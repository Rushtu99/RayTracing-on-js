import { Vector, Ray, Color, getUnitNormalVector } from './utils.js';
let light = new Vector(3, -3, 1).normalize()
let lightIntensity = 100
// let light = new Vector(100,0,-10);
let lim = 100000
let check = [-lim, lim, -lim, lim, -lim, lim];
let temp = 0;
let ttt = new Vector(0, 0, 0)


export function traceRay(ray, scene, depth, xSegment) {
    if (depth == 0) return new Color(255, 255, 255); // Terminate recursion

    let hit = scene.intersect(ray);
    if (hit) {
        // return hit.obj.material.color
        let attenuation = xSegment; //0.7
        let nextRay = hit.obj.material.ray(ray, hit);
        // color = color.add(traceRay(nextRay, scene, depth - 1, xSegment).multiply(attenuation))
        return traceRay(nextRay, scene, depth - 1, xSegment).multiply(attenuation)
        // return traceRay(nextRay, scene, depth - 1, xSegment).multiply(attenuation);
    } // Background color



    let a = 0.5 * (ray.direction.y * 2 + 1.0);
    return ((new Vector(1.0, 1.0, 1.0)).multiply(1.0 - a)).add((new Vector(0.5, 0.7, 1.0)).multiply(a));
}

