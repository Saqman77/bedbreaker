import * as THREE from 'three';

self.onmessage = function(event)
{
    const parameters = event.data
    // const { radius, branches, spin, randomnessPower, insideColor, outsideColor, count} = parameters;
    console.log(parameters)

        const positions = new Float32Array(parameters.count*3)
        const colors = new Float32Array(parameters.count*3)
        const colorInside = new THREE.Color(parameters.insideColor)
        const colorOutside = new THREE.Color(parameters.outsideColor)

            for(let i = 0; i < parameters.count; i++)
                {
                    const i3 = i * 3

                    const radius = Math.random() * parameters.radius
                    const spinAngle = radius * parameters.spin
                    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
                    
                    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
                    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
                    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
                    positions[i3] = Math.sin(branchAngle + spinAngle) * radius + randomX
                    positions[i3 + 1] = randomY
                    positions[i3 + 2] = Math.cos(branchAngle + spinAngle) * radius + randomZ

                    //Colour
                    const mixedColour = colorInside.clone()
                    mixedColour.lerp(colorOutside, radius / parameters.radius)

                    colors[i3] = mixedColour.r
                    colors[i3 + 1] = mixedColour.g
                    colors[i3 + 2] = mixedColour.b
                }

                self.postMessage({ positions, colors});
}
