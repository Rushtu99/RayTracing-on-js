import { Vector } from './utils.js';
import { reconstructScene } from './worker.js'
import { scene, setupScene } from './scene-config.js'
import { renderer } from './renderer-config.js'
let light = new Vector(3, -3, 1).normalize()
let lightIntensity = 100
console.log(scene)
// let light = new Vector(100,0,-10);
let lim = 100000
let check = [-lim, lim, -lim, lim, -lim, lim];
let temp = null;
let ttt = new Vector(0, 0, 0)
export function traceRay(ray, depth, xSegment = 0.7) {
    renderer.incTraceRay()
    let attenuation = 0.7
    if (renderer.debugMode) attenuation = xSegment; //0.7
// console.log(scene)
    if (depth == -1) return new Vector(0, 0, 0); // Terminate recursion
    let hit = scene.intersect(ray);
    if (hit) {
        let color = new Vector(0, 0, 0)
        if (hit.obj.material.constructor.name == "EmmisiveMaterial") {
            attenuation = 10
        }
        color = hit.obj.color(hit).multiply(0.15 * attenuation)
        let currColor = hit.obj.color(hit)

        for (let i = 0; i < renderer.bouncedRays; i++) {
            let nextRay = hit.obj.material.scatteredRay(ray, hit);

            if (nextRay)
                color = color.add(currColor.multiColor(traceRay(nextRay, depth - 1, xSegment).multiply(attenuation)))

        }
        color = color.multiply(1 / (renderer.bouncedRays));
        return color
    }
    // Background color
    let a = 0.5 * (ray.direction.y * 2 + 1.0);
    return ((new Vector(1.0, 1.0, 1.0)).multiply(1.0 - a)).add((new Vector(0.5, 0.7, 1.0)).multiply(a));
}
