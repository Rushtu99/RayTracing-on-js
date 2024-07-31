// main.js

import { Vector, Camera, Sphere, objectCompare, Color, ReflectedMaterial, DiffusedMaterial } from './utils.js';
import { traceRay } from './renderer.js';
import { Toggle, toggleAutoInit } from './scripts/tiny-ui-toggle.js';
import { ShareUrl, ShareUrlAuto } from './scripts/share-url.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


window.addEventListener('DOMContentLoaded', (event) => {
    // Initialize all elements with default options, these can be overridden by reinitializing or with data attributes on the element.
    toggleAutoInit();
    const menuElements = document.querySelectorAll('.menu .toggle');
    for (const item of menuElements) {
        Toggle({ selector: item, target: 'next', group: '.menu .toggle-panel', wrapper: '.demo--menu', closeAuto: true });
    };
    ShareUrlAuto(); const encodeElements = document.querySelectorAll('.encode');
    for (const item of encodeElements) {
        let decode = atob(item.dataset['encode']);

        if (item.dataset['encodeAttribute']) {
            item.setAttribute(`${item.dataset['encodeAttribute']}`, `${decode}`);
        }
    }
});

let camera;
let scene;
let renderer = {
    samplesPerPixel: 15,
    maxBounces: 5,

    brdf: 'phong',
    depthOfField: false,

    accumulate: false,
    renderOnce: true,
    renderOnChange: false,
    skyLight: false,

    setSamplesPerPixel: function (value) { this.samplesPerPixel = value; },
    setNumBounces: function (value) { this.maxBounces = value; },

    setSkyLight: function (value) { this.skyLight = value; },
    setRenderOnChange: function (value) { this.renderOnChange = value; },
    setAccumulate: function (value) { this.accumulate = value; },
    setRenderOnce: function (value) { this.renderOnce = value; },

    setBRDF: function (value) { this.brdf = value; },
    setDepthOfField: function (value) { this.depthOfField = value; },
};
document.getElementById('numBounces').value = renderer.maxBounces
document.getElementById('numBouncesValue').textContent = renderer.maxBounces

document.getElementById('samplesPerPixel').value = renderer.samplesPerPixel
document.getElementById('samplesPerPixelValue').textContent = renderer.samplesPerPixel
// console.log(, renderer)
let rendering = false;
let renderInterval;

function setupScene() {
    let position = new Vector(0, 0, -100);
    let target = new Vector(0, 0, 0);
    let up = new Vector(0, 1, 0);
    let fov = Math.PI / 3;
    let aspectRatio = canvas.width / canvas.height;

    camera = new Camera(position, target, up, fov, aspectRatio);
    let prev = null
    scene = {
        intersect: function (ray) {
            let closestT = Infinity;
            let hitObject = null;
            let hitProperties = null;
            for (let obj of this.objects) {
                let hit = obj.intersect(ray);
                if (hit !== null && !objectCompare(ray.parentObj, hit.obj) && hit.hitDistance < closestT) {
                    // if(hit != prev){console.log(hit,prev);prev = hit;}
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
            new Sphere(new Vector(0, 0, -10), 20, new DiffusedMaterial(new Vector(1, 0, 0), 0.1, 0.5)), // Red, rough
            // new Sphere(new Vector(70, 0, 0), 20, new DiffusedMaterial(new Vector(0, 1, 0), 0.3, 0.1)), // Green, less rough
            // new Sphere(new Vector(30, 40, 100), 70, new DiffusedMaterial(new Vector(0, 0, 1), 0.5, 0.8)), // Blue, metallic
            new Sphere(new Vector(0, -2020, 0), 2000, new DiffusedMaterial(new Vector(1, 1, 0), 0.2, 0.2, 5)), // Yellow, emissive
            new Sphere(new Vector(-60, 30, 30), 30, new DiffusedMaterial(new Vector(1, 1, 1), 0.0, 0.0, 0)), // White, non-emissive

            // new Sphere(new Vector(0, 0, -10), 20, new ReflectedMaterial(new Vector(1, 0, 0), 0.1, 0.5)), // Red, rough
            new Sphere(new Vector(70, 0, 0), 20, new ReflectedMaterial(new Vector(0, 1, 0), 0.3, 0.1)), // Green, less rough
            new Sphere(new Vector(30, 40, 100), 70, new ReflectedMaterial(new Vector(0, 0, 1), 0.5, 0.8)), // Blue, metallic
            // new Sphere(new Vector(0, -2020, 0), 2000, new ReflectedMaterial(new Vector(1, 1, 0), 0.2, 0.2, 5)), // Yellow, emissive
            // new Sphere(new Vector(-60, 30, 30), 30, new ReflectedMaterial(new Vector(1, 1, 1), 0.0, 0.0, 0)) // White, non-emissive
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
    let prevPerformance, nowPerformance;

    let ttt = new Vector(0, 0, 0);
    let lim = 1000
    let check = [-lim, lim];
    let te, t = 20
    let cur = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let u = x
            let v = height - y
            let color = new Vector(0, 0, 0);
            for (let s = 0; s < renderer.samplesPerPixel; s++) {
                let ray = camera.getRay(u, v);
                Math.floor((10 * v / height)) / 10 * 255
                let xSegment = Math.floor((10 * u / width)) / 10.0;
                color = color.add(traceRay(ray, scene, renderer.maxBounces, xSegment));
                // color = color.add(new Vector(0, xSegment , 0))
            }
            if (camera.position != cameraControl) {
                console.log("CAMERAA", cameraControl, camera.position, camera, "cameraa")
                cameraControl = camera.position
            }
            color = color.multiply(1 / (renderer.samplesPerPixel));
            let index = (y * width + x) * 4;
            data[index] = Math.sqrt(color.x) * 255;
            data[index + 1] = Math.sqrt(color.y) * 255;
            data[index + 2] = Math.sqrt(color.z) * 255;
            data[index + 3] = 255;

            //performance indicator t
            if (te != Math.floor((y / height) * t)) {
                te = Math.floor((y / height) * t)
                prevPerformance = nowPerformance;
                nowPerformance = performance.now()
                console.log(Math.round((y / height) * 100) + "%.. ", Math.trunc(nowPerformance - startTime), "ms (+", Math.trunc(nowPerformance - prevPerformance), "ms)")

            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    let endTime = performance.now();
    let duration = endTime - startTime;
    console.log(`Render time: ${duration.toFixed(2)} ms`);
}
let prevTime = 3000
function startRendering() {
    console.log("Rendering...   ==============================================================")
    if (rendering) return;
    rendering = true;
    if (renderer.renderOnce) {
        render();
        rendering = false
    }
    else {
        // if (prevTime == 3000) { renderInterval = setInterval(render, 3000) }
        { renderInterval = setInterval(render, prevTime * 1.25) }
    }
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
        if (renderer.renderOnChange) render();
    });

    document.getElementById('lensRadius').addEventListener('change', function () {
        renderer.setDepthOfField(this.checked);
        if (renderer.renderOnChange) render();
    });

    document.getElementById('numBounces').addEventListener('input', function () {
        let value = parseInt(this.value, 10);
        document.getElementById('numBouncesValue').textContent = value;
        renderer.setNumBounces(value);
        if (renderer.renderOnChange) render();
    });


    document.getElementById('renderOnChange').addEventListener('change', function () {
        renderer.setRenderOnChange(this.checked);
        if (renderer.renderOnChange) render();
    });

    document.getElementById('skylightButton').addEventListener('change', function () {
        renderer.setSkylightButton(this.checked);
        if (renderer.renderOnChange) render();
    });

    document.getElementById('accumulateButton').addEventListener('change', function () {
        renderer.setAccumulate(this.checked);
        if (renderer.renderOnChange) render();
    });

    document.getElementById('renderOnce').addEventListener('change', function () {
        renderer.setRenderOnce(this.checked);
        if (renderer.renderOnChange) render();
    });

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
