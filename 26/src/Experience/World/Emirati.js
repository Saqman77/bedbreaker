import * as THREE from 'three'
import Experience from '../Experience.js';

export default class Emirati
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // // Debug
        // if(this.debug.active)
        // {
        //     this.debugFolder = this.debug.ui.addFolder('emirati')
        // }

        // Setup
        this.resource = this.resources.items.emiratiModel
        
        this.setModel()

    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(1.2, 1.2, 1.2)
        this.model.position.set(0, 0, 0)
        // this.model.
        this.scene.add(this.model)

        this.model.traverse((child) => 
            {
                if(child instanceof THREE.Mesh)
                {
                    console.log(child)
                    child.castShadow = true
                }
            })

             //Debug

            if(this.debug.active)
                {
                    // this.debugFolder.add(this.model.scale, 'x', 'y', 'z').name('size').min(0).max(10).step(0.001)
                    // this.debugFolder.add(this.model.scale.set, '{x: , y: , z: }').name('sunLightintensity').min(0).max(10).step(0.001)
                    // this.debugFolder.add(this.model.scale, 'z').name('sunLightintensity').min(0).max(10).step(0.001)
                }
    }

}   