// main.js

import { Vector, Camera, Material, Sphere, objectCompare } from './utils.js';
import { traceRay } from './renderer.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let camera;
let scene;
let renderer = {
    samplesPerPixel: 5,
    maxBounces: 1,
    accumulate: false,
    brdf: 'phong',
    depthOfField: false,
    renderOnce: true,
    setRenderOnce: function (value) { this.renderOnce = value; },
    setSamplesPerPixel: function (value) { this.samplesPerPixel = value; },
    setNumBounces: function (value) { this.maxBounces = value; },
    setAccumulate: function (value) { this.accumulate = value; },
    setBRDF: function (value) { this.brdf = value; },
    setDepthOfField: function (value) { this.depthOfField = value; },
};

let rendering = false;
let renderInterval;

function setupScene() {
    let position = new Vector(0, 0, -100);
    let target = new Vector(0, 0, 0);
    let up = new Vector(0, 1, 0);
    let fov = Math.PI / 3;
    let aspectRatio = canvas.width / canvas.height;
    let light = new Vector(1, 1, 1).normalize()
    camera = new Camera(position, target, up, fov, aspectRatio);
    let prev = null
    scene = {
        intersect: function (ray) {
            let closestT = Infinity;
            let hitObject = null;
            let hitProperties = null;
            for (let obj of this.objects) {
                let t = obj.intersect(ray);
                if (t !== null && !objectCompare(ray.parentObj, t.obj) && t.hitDistance < closestT) {
                    // if(t != prev){console.log(t,prev);prev = t;}
                    closestT = t.hitDistance;
                    hitObject = t;
                    hitObject.hitProperties = t;
                }
            }
            return hitObject;
        },
        lights: [
            // Placeholder for light sources
        ],
        objects: [
            new Sphere(new Vector(0, 0, -10), 20, new Material(new Vector(1, 0, 0), 0.1, 0.5)), // Red, rough
            new Sphere(new Vector(40, 0, 0), 20, new Material(new Vector(0, 1, 0), 0.3, 0.1)), // Green, less rough
            new Sphere(new Vector(10, 0, 60), 30, new Material(new Vector(0, 0, 1), 0.5, 0.8)), // Blue, metallic
            new Sphere(new Vector(0, -2020, 0), 2000, new Material(new Vector(1, 1, 0), 0.2, 0.2, 5)), // Yellow, emissive
            new Sphere(new Vector(10, 0, 30), 30, new Material(new Vector(1, 1, 1), 0.0, 0.0, 0)) // White, non-emissive
        ]
    };
}

function render() {
    let width = canvas.width;
    let height = canvas.height;
    let imageData = ctx.createImageData(width, height);
    let data = imageData.data;
    let cameraControl = null
    let startTime = performance.now();


    let ttt = new Vector(0, 0, 0);
    let lim = 1000
    let check = [-lim, lim];
    let te, t=20 
    let cur = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let u = x
            let v = height - y
            let color = new Vector(0, 0, 0);
            for (let s = 0; s < renderer.samplesPerPixel; s++) {
             let ray = camera.getRay(u, v);
                color = color.add(traceRay(ray, scene, renderer.maxBounces));
            }
            if (camera.position != cameraControl) {
                console.log("CAMERAA", cameraControl, camera.position, camera, "cameraa")
                cameraControl = camera.position
            }
            color = color.multiply(1 / renderer.samplesPerPixel);

            // color change indicator
            // if (ttt.x != color.x) {
            //     console.log(color)
            //     ttt = color
            // }
            let index = (y * width + x) * 4;
            data[index] = color.x * 255;
            data[index + 1] = color.y * 255;
            data[index + 2] = color.z * 255;
            data[index + 3] = 255;

            if (te != Math.floor((y / height) * t)) {
                te = Math.floor((y / height) * t) 
                console.log(Math.round((y/height)*100) +"%..." )
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);

    let endTime = performance.now();
    let duration = endTime - startTime;
    console.log(`Render time: ${duration.toFixed(2)} ms`);
}

function startRendering() {
    // if (rendering) return;
    rendering = true;
    // if (rendererrenderOnce) {
    render();
    // }
    // else {
    //     renderInterval = setInterval(render, 3000);
    // }
}

function stopRendering() {

    if (!rendering) return;
    rendering = false;
    clearInterval(renderInterval);
}

function setupControls() {
    document.getElementById('samplesPerPixel').addEventListener('input', function () {
        let value = parseInt(this.value, 10);
        document.getElementById('samplesPerPixelValue').textContent = value;
        renderer.setSamplesPerPixel(value);
        if (rendering) render();
    });

    document.getElementById('numBounces').addEventListener('input', function () {
        let value = parseInt(this.value, 10);
        document.getElementById('numBouncesValue').textContent = value;
        renderer.setNumBounces(value);
        if (rendering) render();
    });

    document.getElementById('accumulateButton').addEventListener('change', function () {
        renderer.setAccumulate(this.checked);
        if (rendering) render();
    });

    document.getElementById('lensRadius').addEventListener('change', function () {
        renderer.setDepthOfField(this.checked);
        if (rendering) render();
    });

    // document.getElementById('renderOnce').addEventListener('change', function () {
    //     renderer.setRenderOnce(this.checked);
    //     if (rendering) render();
    // });

    document.getElementById('camX+').addEventListener('click', cameraReset);
    document.getElementById('camX-').addEventListener('click', cameraReset);
    document.getElementById('camY+').addEventListener('click', cameraReset);
    document.getElementById('camY-').addEventListener('click', cameraReset);
    document.getElementById('camZ+').addEventListener('click', cameraReset);
    document.getElementById('camZ-').addEventListener('click', cameraReset);



    document.getElementById('startRender').addEventListener('click', startRendering);
    document.getElementById('stopRender').addEventListener('click', stopRendering);
}

let multiplier = 10;
function cameraReset(e) {
    let index = e.target.value
    stopRendering()
    switch (Number(index)) {
        case 0:
            camera.position.x += multiplier;
            break;

        case 1:
            camera.position.x -= multiplier;
            break;

        case 2:
            camera.position.y += multiplier;
            break;

        case 3:
            camera.position.y -= multiplier;
            break;

        case 4:
            camera.position.z += multiplier;
            break;

        case 5:
            camera.position.z -= multiplier;
            break;

    }

}

function resizeCanvas() {
    canvas.width = window.innerWidth - 400;
    canvas.height = window.innerHeight - 60;
    camera.aspectRatio = canvas.width / canvas.height;
    camera.update();
    // if (rendering) render();
}

window.addEventListener('resize', resizeCanvas);

setupScene();
setupControls();
resizeCanvas();
