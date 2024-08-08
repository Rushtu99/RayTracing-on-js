import { Vector } from './utils.js'
import { Sphere } from './objects.js';
import { Camera } from './camera.js';
import { ReflectedMaterial, DiffusedMaterial, EmmisiveMaterial, RefractedMaterial } from './materials.js'
import { objectCompare, Color, randRange } from "./utilFunctions.js"
import { loadOBJModels } from './modelParser.js';

export let camera;
export let scene = {};
let paths = []
// let paths = ['./icosahedron.obj']
// console.log("scene called")
export async function setupScene(objData = null) {
    console.log("inside setup")
    let position = new Vector(0, 80, -260);
    // let position = new Vector(0,150,-1);
    let target = new Vector(0, 0, 0);
    let up = new Vector(0, 1, 0);
    let fov = Math.PI / 2.5;
    let meshes = []
    camera = new Camera(position, target, up, fov);


    let prev = null
    scene = {
        add: function (objList) {
            for (const obj in objList) {
                scene.objects.push(objList[obj])
            }
        },
        intersect: function (ray) {
            let closestT = Infinity;
            let hitObject = null;
            let hitProperties = null;
            for (let obj of this.objects) {
                // console.log(this.objects)

                if (!Object.is(ray.parentObj, obj)) {
                    let hit = obj.intersect(ray);
                    if (hit !== null && hit.hitDistance < closestT) {
                        closestT = hit.hitDistance;
                        hitObject = hit;
                        hitObject.hitProperties = hit;
                    }
                }
            }
            return hitObject;
        },
        lights: [
            // Placeholder for light sources
        ],

        objects: [
            ...meshes,
            // new Sphere(new Vector(0, 0, 0), 20, new RefractedMaterial(Color(223, 255, 0), 2)), // Yellow, emissive
            // new Sphere(new Vector(0, 0, 0), 12, new RefractedMaterial(Color(223, 255, 0), 1 / 2.0)), // Yellow, emissive
            new Sphere(new Vector(41, 0, 10), 20, new DiffusedMaterial(Color(46, 35, 108))), // Yellow, emissive
            new Sphere(new Vector(-41, 0, 10), 20, new ReflectedMaterial(Color(223, 255, 0), 0.01)), // Yellow, emissive
            // new Sphere(new Vector(0, 0, 60), 10, new EmmisiveMaterial(Color(255, 191, 0))), // White, non-emissive



            // new Sphere(new Vector(0, 0, -10), 20, new DiffusedMaterial(new Vector(1, 0.01, 0.01), 0.1, 0.5)), // Red, rough
            // new Sphere(new Vector(-60, 30, -30), 30, new EmmisiveMaterial(new Vector(0.5, 1, 0.95), 0.0, 0.0, 0)), // White, non-emissive
            // new Sphere(new Vector(0, 0, 0), 20, new RefractedMaterial(new Vector(0.1, 1, 0.1), 0.3, 0.1)), // Green, less rough
            // new Sphere(new Vector(40, 50, 200), 60, new ReflectedMaterial(new Vector(0.05, 0.05, 1), 0.5, 0.8)), // Blue, metallic


            new Sphere(new Vector(0, -2020, 0), 2000, new DiffusedMaterial(Color(108, 3, 69), 0.2, 0.2, 5), true), // Yellow, emissive
        ]
    };
    await loadOBJModels(paths);
    await getRandomSpheres(100);
}

function check(x,y,z,r,spheres){
    console.log(x,y,z,r,spheres)
    let a,b,c;
    let d = 1;
    let dr = -1;
    for(let sphere in spheres){
        a = x-spheres[sphere].center.x
        b = y-spheres[sphere].center.y
        c = z-spheres[sphere].center.z
        dr = r+spheres[sphere].radius-15
        d = Math.sqrt(a*a+b*b+c*c)
        if(d<dr){
            console.log("intersecting",d,dr,sphere)
            return true
        }
    }
    console.log("not intersecting",d,dr)
    return false
}

async function getRandomSpheres(count){
    // console.log("generating random spheres")
    let spheres = [];
    let material;
    let r,x,y,z,mat;
    for(let i=0;i<count;i++){
        do{
            r = randRange(1,20)
            x = randRange(-200,200)
            y = r
            z = randRange(-200,200)
            console.log("creating new sphere")
        }
        while(check(x,y,z,r,spheres,spheres.length))
        mat = Math.floor(Math.random()*4)
        material
        switch (mat) {
            case 0:
                material = new ReflectedMaterial(Color(Math.random()*255, Math.random()*255, Math.random()*255), randRange(0,0.5))
                break;
            case 1:
                material = new DiffusedMaterial(Color(Math.random()*255, Math.random()*255, Math.random()*255))
                break;
            case 2:
                material = new RefractedMaterial(Color(Math.random()*255, Math.random()*255, Math.random()*255), randRange(0,4))
                break;
            case 3:
                material = new EmmisiveMaterial(Color(Math.random()*255, Math.random()*255, Math.random()*255))
                break;
            default:
                break;
        }
        spheres.push(new Sphere(new Vector(x, y, z), r, material)) // Yellow, emissive
        console.log("sphere added",spheres.length)
    }
    scene.add(spheres)
}

await setupScene();
