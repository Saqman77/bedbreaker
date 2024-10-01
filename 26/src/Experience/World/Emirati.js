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
        this.environment = this.experience.environment
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('emirati')
        }

        // Setup
        this.resource = this.resources.items.emiratiModel

        
        this.setModel()
        // this.update()

    }

    setModel()
    {
        this.model = this.resource.scene
        const emissiveColour = new THREE.Color(1, 0, 1)
        // this.model.Mesh.Geometry.computeFaceNormals(); 
        // this.model.Geometry.computeVertexNormals(); 

        // this.model.colorSpace = THREE.SRGBColorSpace

        // this.model.material = new THREE.MeshPhongMaterial(
        //     {
        //         color:0xffff00
        //     })

        this.model.side = THREE.DoubleSide
        this.model.scale.set(1.2, 1.2, 1.2)
        this.model.position.set(0, 0, 0)
        // this.model.material = new THREE.MeshBasicMaterial({color: '#1b8360'})
        // const materialColor = '#1b8360'
        // this.model.

        this.scene.add(this.model)

        this.scene.traverse((child) => 
            {
                if(child instanceof THREE.Mesh )
                {
                        // child.geometry.computeFaceNormals(); 
                        child.geometry.computeVertexNormals();

                        for(const key in child.material)
                            
                            {
                                const value = child[key]

                                console.log(child[key])

                                // if(value instanceof THREE.BufferGeometry)
                                // {
                                //     value.computeFaceNormals(); 
                                //     value.computeVertexNormals();
                                // }

                                // if(value.material instanceof THREE.BufferGeometry)
                                // {
                                //     value.computeFaceNormals(); 
                                //     value.computeVertexNormals();
                                // }
                            }

                        // if (child.name == 'environment')
                        //     child.name
                        // child.geometry.computeFaceNormals(); 
                        // child.geometry.computeVertexNormals(); 

                        // if (child.material.normalMap) {
                        //     child.material.normalMap.needsUpdate = true;
                        // }
                    
                        // // // Remove texture map to allow color change
                        // if (child.material.map) {
                        //     child.material.map = null;
                        // }
                
                        // // // Apply new color
                        // child.material =  new THREE.MeshPhongMaterial( 
                        //     {
                        //         // color: 0xff0000,
                        //         // side: THREE.DoubleSide,
                        //         // shininess: 0,
                        //         // emissive: emissiveColour,
                        //         // emissiveIntensity:0.5,
                        //         // specular: 0x00000,
                        //         // blending: THREE.AdditiveBlending,
                        //         // vertexColors:true
                        //     } )
                        // child.material.side = THREE.DoubleSide
                        // child.material.color = new THREE.Color(1, 0, 1); // Magenta color
                
                        // // // Check if normal map exists and update it if needed
                        // // if (child.material.normalMap) {
                        // //     child.material.normalMap.needsUpdate = true;
                        // // }
                
                        // // // Adjust metalness and roughness if necessary
                        // // child.material.metalness = 0.5;
                        // // child.material.roughness = 0.5;
                
                        // // // Ensure the material is updated
                        // // child.material.needsUpdate = true;
                    
                }
                
            })

            //  //Debug
            //  if(this.debug.active)
            //     {
            //         this.debugFolder
            //             .addColor(emissiveColour)
            //             .onChange(() =>
            //                     {
            //                         (materialColor)
            //                     })
            //     }
            
    }
    // update()
    // {
    //     // this.environment.environmentMap.updateMaterials()
    //     // this.scene.matrixWorldNeedsUpdate = true
    // }

}
