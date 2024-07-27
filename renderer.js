import { Vector, Ray } from './utils.js';
let light = new Vector(-1, -1, 1)
export function traceRay(ray, scene, depth) {
    let color = new Vector(0, 0, 0);
    if (depth <= 0) return new Vector(0, 0, 0); // Terminate recursion

    let hit = scene.intersect(ray);
    if (!hit) return new Vector(0, 0, 0); // Background color
    // let normal = hit.hitProperties.normal;
    // let direction = ray.direction.subtract(normal.multiply(2 * ray.direction.dot(normal))).normalize();
    // let reflect = new Ray(hit.hitProperties.point, direction);
    //  color = hit.material.color.multiply(light.dot(reflect.direction));  // Base ambient color
    color = hit.hitProperties.material.color;

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

    return color;
}

export function reflectRay(ray, hit) {
    let normal = hit.normal;
    let direction =
        ray.direction.subtract(normal.multiply(2 * ray.direction.dot(normal)));
    return new Ray(hit.point, direction);
}


export function refractRay(ray, hit) {
    // Placeholder for refraction calculation
    return new Ray(hit.hitProperties.point, ray.direction); // To be implemented
}

export function calculateDirectLighting(hit, light, ray) {
    // Placeholder for direct lighting calculation
    return new Vector(1, 1, 1); // Dummy value
}
