import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from './Experience.js';

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('camera')
        }

        this.setInstance()
        this.setOrbitControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(0, 2.38, 2)
        this.scene.add(this.instance)

        //Debug
        if(this.debug.active)
            {
                this.debugFolder.add(this.instance.position, 'x').name('CameraX').min(-5).max(5).step(0.001)
                this.debugFolder.add(this.instance.position, 'y').name('CameraY').min(-5).max(5).step(0.001)
                this.debugFolder.add(this.instance.position, 'z').name('CameraZ').min(-5).max(5).step(0.001)
            }
        }

    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.target.set(0, 1.6, 0)
        this.controls.enableDamping = true

        //Debug
        if(this.debug.active)
            {
                this.debugFolder.add(this.controls.target, 'x').name('TargetX').min(-5).max(5).step(0.001)
                this.debugFolder.add(this.controls.target, 'y').name('TargetY').min(-5).max(5).step(0.001)
                this.debugFolder.add(this.controls.target, 'z').name('TargetZ').min(-5).max(5).step(0.001)
            }
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}