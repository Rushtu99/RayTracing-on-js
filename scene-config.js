import { Vector, Camera, Sphere, Color } from './utils.js'
import { ReflectedMaterial, DiffusedMaterial, EmmisiveMaterial, RefractedMaterial } from './materials.js'
import { objectCompare } from "./utilFunctions.js"
export let camera;
export let scene ;
setupScene();


export function setupScene() {
    let position = new Vector(-50, 100, -80);
    let target = new Vector(0, 0, 0);
    let up = new Vector(0, 1, 0);
    let fov = Math.PI / 2.5;

    camera = new Camera(position, target, up, fov);
    let prev = null
    scene = {
        intersect: function (ray) {
            let closestT = Infinity;
            let hitObject = null;
            let hitProperties = null;
            for (let obj of this.objects) {

                let hit = obj.intersect(ray);
                if (hit !== null && !objectCompare(ray.parentObj, hit.obj) && hit.hitDistance < closestT) {
                    closestT = hit.hitDistance;
                    hitObject = hit;
                    hitObject.hitProperties = hit;
                }
            }
            return hitObject;
        },
        lights: [
            // Placeholder for light sources
        ],

        objects: [
            new Sphere(new Vector(0, 0, 0), 20, new RefractedMaterial(new Color(223, 255, 0), 2)), // Yellow, emissive
            new Sphere(new Vector(0, 0, 0), 12, new RefractedMaterial(new Color(223, 255, 0), 1 / 2.0)), // Yellow, emissive

            new Sphere(new Vector(41, 0, 10), 20, new DiffusedMaterial(new Color(46, 35, 108))), // Yellow, emissive
            new Sphere(new Vector(-41, 0, 10), 20, new ReflectedMaterial(new Color(223, 255, 0), 0.01)), // Yellow, emissive
            new Sphere(new Vector(0, 0, 60), 10, new EmmisiveMaterial(new Color(255, 191, 0))), // White, non-emissive



            // new Sphere(new Vector(0, 0, -10), 20, new DiffusedMaterial(new Vector(1, 0.01, 0.01), 0.1, 0.5)), // Red, rough
            new Sphere(new Vector(0, -2020, 0), 2000, new DiffusedMaterial(new Color(108, 3, 69), 0.2, 0.2, 5), true), // Yellow, emissive
            // new Sphere(new Vector(-60, 30, -30), 30, new EmmisiveMaterial(new Vector(0.5, 1, 0.95), 0.0, 0.0, 0)), // White, non-emissive
            // new Sphere(new Vector(0, 0, 0), 20, new RefractedMaterial(new Vector(0.1, 1, 0.1), 0.3, 0.1)), // Green, less rough
            // new Sphere(new Vector(40, 50, 200), 60, new ReflectedMaterial(new Vector(0.05, 0.05, 1), 0.5, 0.8)), // Blue, metallic
        ]
    };
}