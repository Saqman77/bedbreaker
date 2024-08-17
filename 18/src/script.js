import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
import Worker from './worker.js?worker'
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 300000
parameters.size = 0.01
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let particlesGeometry = null
let particlesMaterial = null
let particles = null

function chunkify(array,n)
{
    let chunks = []
    for (let i = n; i > 0; i--)
    {
        chunks.push(array.slice(0,Math.ceil(array.length/i)))
    }
    return chunks;
}
// let isGenerating = false;
const generateGalaxy = () => {

    // if (isGenerating) return; // Prevent multiple calls
    // isGenerating = true;
    const cleanParams = {
        count: parameters.count,
        radius: parameters.radius,
        branches: parameters.branches,
        spin: parameters.spin,
        randomnessPower: parameters.randomnessPower,
        insideColor: parameters.insideColor,
        outsideColor: parameters.outsideColor
    };
           // Destroy old galaxy
           if (particles !== null) {
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            scene.remove(particles);
            particles = null;
            particlesGeometry = null;
            particlesMaterial = null;
        }
    let completedWorkers = 0;
    let allPositions = [];
    let allColors = [];

 

    // Create an array of indices representing the total particle count
    const arrayToChunk = new Array(parameters.count);

    // Split the array into chunks for workers
    const chunks = chunkify(arrayToChunk, 3); // Adjust the number of chunks/workers as needed

    chunks.forEach((chunk, i) => {
        const worker = new Worker();
        const chunkSize = chunk.length;
        worker.postMessage({ ...cleanParams, count: chunkSize });


        worker.onmessage = function (event) {
            // Safely handle large datasets incrementally if needed
            const { positions, colors } = event.data;
           console.log(`worker ${i} completed`)
            // Process small batches to avoid stack overflow
            // for (let i = 0; i < positions.length; i += 3000) {
            //     allPositions.push(...positions.slice(i, i + 3000));
            //     allColors.push(...colors.slice(i, i + 3000));
            // }
            
            
        
            completedWorkers++;
        
            if (completedWorkers === chunks.length) {
                console.log(`Expected particles: ${parameters.count*3}`);
            console.log(`Actual particles: ${positions.length / 3}`);
                // Create geometry only when all workers are done
                particlesGeometry = new THREE.BufferGeometry();
                particlesGeometry.setAttribute(
                    'position',
                    new THREE.BufferAttribute(new Float32Array(positions), 3)
                );
                particlesGeometry.setAttribute(
                    'color',
                    new THREE.BufferAttribute(new Float32Array(colors), 3)
                );
                // particlesGeometry.attributes.position.needsUpdate = true;
                // particlesGeometry.attributes.color.needsUpdate = true;
        
                particlesMaterial = new THREE.PointsMaterial({
                    size: parameters.size,
                    sizeAttenuation: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    vertexColors: true,
                });
        
                particles = new THREE.Points(particlesGeometry, particlesMaterial);
                // isGenerating = false; 
                
                scene.add(particles);
                
            }
        };
    });
};

    generateGalaxy()
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(- 5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)



// gsap.from(parameters,
//     {
//         duration:3,
//         count:100,
//         radius:1,
//         onStart:generateGalaxy,
//         onUpdate:generateGalaxy,
//         onComplete:generateGalaxy
//     })


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
   
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // particles.rotation.y = elapsedTime * 0.05

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()