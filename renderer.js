import { Vector, Ray, Color, getUnitNormalVector } from './utils.js';
let light = new Vector(3, -3, 1).normalize()
let lightIntensity = 100
// let light = new Vector(100,0,-10);
let lim = 100000
let check = [-lim, lim, -lim, lim, -lim, lim];
let temp = 0;
let ttt = new Vector(0, 0, 0)


export function traceRay(ray, scene, depth) {
    if (depth <= 0) return new Vector(0, 0, 0); // Terminate recursion

    let hit = scene.intersect(ray);
    let t = 15
    if (!hit || hit == null) return new Color(t, t, t); // Background color
    let normal = hit.hitProperties.normal;
    let direction = ray.direction
    let val = hit.obj.material.color
    let color = new Vector(val.x,val.y,val.z).multiply(1);
    while(depth){
        // console.log(depth)
        color = color.multiply(0.5);
        let nextRay = DiffusedRay(ray,hit)
        let nextHit = scene.intersect(nextRay)
        if(!nextHit){
            depth = 1
        }
        --depth
    }

    return color

//REFLECTED RAY + LIGHTING 
// let reflect = reflectRay(ray, hit);
// let reflectHit = scene.intersect(reflect)
// let colorFactor = ((-(light).dot(reflect.direction))+0.5)*0.6
// color = hit.obj.material.color.multiply(
//     (Math.pow(colorFactor,0.8)) )
// if(-(light).dot(reflect.direction)>0.98) color = new Vector(1, 1, 1)

//DIFFUSED LIGHTING








// Direct lighting
// for (let light of scene.lights) {
//     color = color.add(calculateDirectLighting(hit, light, ray));
// }


// Reflections
// if (hit.material.roughness < 1) {
//     let reflectionRay = reflectRay(ray, hit);
//     let reflectionColor = traceRay(reflectionRay, scene, depth - 1);
//     color = color.add(reflectionColor.multiply(hit.material.roughness));
// }

// // Refractions
// if (hit.material.metallic > 0) {
//     let refractionRay = refractRay(ray, hit);
//     let refractionColor = traceRay(refractionRay, scene, depth - 1);
//     color = color.add(refractionColor.multiply(hit.material.metallic));
// }

}

export function reflectRay(ray, hit) {
    let normal = hit.normal;
    let direction =
        ray.direction.subtract(normal.multiply(2 * ray.direction.dot(normal)));
    return new Ray(hit.point, direction, hit.obj);
}


export function refractRay(ray, hit) {
    // Placeholder for refraction calculation

    return new Ray(hit.hitProperties.point, ray.direction, hit.obj); // To be implemented
}

export function DiffusedRay(ray, hit) {
    // Placeholder for refraction calculation
    let seed = getUnitNormalVector()
    if (seed.dot(hit.normal) < 0) {
        seed = seed.multiply(-1)
    }
    return new Ray(hit.hitProperties.point, seed, hit.obj); // To be implemented
}

export function calculateDirectLighting(hit, light, ray) {
    // Placeholder for direct lighting calculation
    return new Vector(1, 1, 1); // Dummy value
}
