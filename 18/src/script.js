import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
import worker from './worker.js?worker'
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
parameters.count = [300000]
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
        chunks.push(array.splice(0,Math.ceil(array.length/i)))
    }
    return chunks;
}

const generateGalaxy =  () =>
    {
        const cleanParams = {
            count: parameters.count,
            radius: parameters.radius,
            branches: parameters.branches,
            spin: parameters.spin,
            randomnessPower: parameters.randomnessPower,
            insideColor: parameters.insideColor,
            outsideColor: parameters.outsideColor
        };

        let completedWorkers = 0;

        
        /**
         * Destroy old galaxy
         */
        if(particles !== null)
            {
                particlesGeometry.dispose()
                particlesMaterial.dispose()
                scene.remove(particles)
            };

            const workerParams = {
                ...cleanParams
            };
    

        //Geometry
        particlesGeometry = new THREE.BufferGeometry()
        const positions = new Float32Array(parameters.count * 3)
        const colors = new Float32Array(parameters.count * 3)
        const chunks = chunkify(cleanParams.count,2)
        chunks.forEach((data,i)=>
            {
                const worker = new Worker()
                cleanParams.count = data
                worker.postMessage(workerParams);
                worker.onmessage = function(event)
                {
                    console.log(`workers${i} completed`)
                    completedWorkers++
                    const data = event.data;
                    const positions = new Float32Array(data.positions);
                    const colors = new Float32Array(data.colors);
                     //BufferAttribute
                    particlesGeometry.setAttribute(
                        'position',
                        new THREE.BufferAttribute(positions, 3)
                    )
                    particlesGeometry.setAttribute(
                        'color',
                        new THREE.BufferAttribute(colors, 3)
                    )
                    if (completedWorkers === 2)
                    {
                        //Material
                        particlesMaterial = new THREE.PointsMaterial(
                        {
                            size : parameters.size,
                            sizeAttenuation : true,
                            // color : new THREE.Color('red'),
                            depthWrite: false,
                            blending: THREE.AdditiveBlending,
                            vertexColors: true
                        })
                        /**
                         * Points
                         */
                         particles = new THREE.Points(particlesGeometry, particlesMaterial)
                         scene.add(particles)
                    }
                   
                }

            })
        

    }

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



gsap.from(parameters,
    {
        duration:3,
        count:40000,
        radius:1,
        onUpdate:generateGalaxy
    })


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

    particles.rotation.y = elapsedTime * 0.05

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()