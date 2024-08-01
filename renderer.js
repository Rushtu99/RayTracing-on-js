import { Vector, Ray, Color } from './utils.js';
import { renderer } from './main.js'
import { ReflectedMaterial } from './materials.js';
let light = new Vector(3, -3, 1).normalize()
let lightIntensity = 100
// let light = new Vector(100,0,-10);
let lim = 100000
let check = [-lim, lim, -lim, lim, -lim, lim];
let temp = 0;
let ttt = new Vector(0, 0, 0)


export function traceRay(ray, scene, depth, xSegment) {
    let attenuation = 0.7
    if(renderer.debugMode)attenuation = xSegment; //0.7

    if (depth == 0) return new Color(0, 0, 0); // Terminate recursion
    let hit = scene.intersect(ray);
    if (hit) {
        // let color = new Vector(0,0,0)
        let color = hit.obj.color(hit).multiply(1)
        // return hit.obj.material.color
        // if (hit.obj.material.constructor.name == "ReflectedMaterial") {
        //     attenuation = 1
        // }
        let currColor = hit.obj.color(hit)
        for (let i = 0; i < renderer.bouncedRays; i++) {
            let nextRay = hit.obj.material.scatteredRay(ray, hit);
            if (nextRay)
                color = color.add(currColor.multiColor(traceRay(nextRay, scene, depth - 1, xSegment).multiply(1)))
        }
        color = color.multiply(1 / (renderer.bouncedRays));

        // return hit.object.material.color.dot(traceRay(nextRay, scene, depth - 1, xSegment).multiply(attenuation))
        return color
        // return traceRay(nextRay, scene, depth - 1, xSegment).multiply(attenuation);
    } // Background color



    let a = 0.5 * (ray.direction.y * 2 + 1.0);
    return ((new Vector(1.0, 1.0, 1.0)).multiply(1.0 - a)).add((new Vector(0.5, 0.7, 1.0)).multiply(a));
}

