// main.js

import { Vector, Camera, Sphere, Color } from './utils.js';
import { ReflectedMaterial, DiffusedMaterial, EmmisiveMaterial, RefractedMaterial } from './materials.js'
import { objectCompare, nFormatter } from "./utilFunctions.js"
import { traceRay } from './renderer.js';
import { Toggle, toggleAutoInit } from './src/tiny-ui-toggle.js';
import { ShareUrl, ShareUrlAuto } from './src/share-url.js';
import { renderer, getRendererData } from './renderer-config.js'
import { scene, camera, setupScene } from './scene-config.js'
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


window.addEventListener('DOMContentLoaded', (event) => {
    toggleAutoInit();
    const menuElements = document.querySelectorAll('.menu .toggle');
    for (const item of menuElements) {
        Toggle({ selector: item, target: 'next', group: '.menu .toggle-panel', wrapper: '.demo--menu', closeAuto: true });
    }
    ShareUrlAuto();
    const encodeElements = document.querySelectorAll('.encode');
    for (const item of encodeElements) {
        let decode = atob(item.dataset['encode']);
        if (item.dataset['encodeAttribute']) {
            item.setAttribute(`${item.dataset['encodeAttribute']}`, `${decode}`);
        }
    }
});

// export let scene;
// export let renderer = {
//     samplesPerPixel: 15,
//     maxBounces: 5,
//     bouncedRays: 1,
//     brdf: 'phong',
//     depthOfField: false,
//     debugMode: false,

//     accumulate: false,
//     renderOnce: true,
//     renderOnChange: false,
//     skyLight: false,
//     traceRayCount: 0,

//     resetTraceRay: function () { this.traceRayCount = 0; this.update() },
//     incTraceRay: function () { this.traceRayCount++; this.update() },
//     setSamplesPerPixel: function (value) { this.samplesPerPixel = value; this.update() },
//     setNumBounces: function (value) { this.maxBounces = value; this.update() },
//     setDebugMode: function (value) { this.debugMode = value; this.update() },
//     setSkyLight: function (value) { this.skyLight = value; this.update() },
//     setRenderOnChange: function (value) { this.renderOnChange = value; this.update() },
//     setAccumulate: function (value) { this.accumulate = value; this.update() },
//     setRenderOnce: function (value) { this.renderOnce = value; this.update() },

//     setBRDF: function (value) { this.brdf = value; this.update() },
//     setDepthOfField: function (value) { this.depthOfField = value; this.update() },
//     update: function () {
//         document.getElementById('numBounces').value = renderer.maxBounces
//         document.getElementById('numBouncesValue').textContent = renderer.maxBounces
//         document.getElementById('samplesPerPixel').value = renderer.samplesPerPixel
//         document.getElementById('samplesPerPixelValue').textContent = renderer.samplesPerPixel
//     }
// };

document.getElementById('numBounces').value = renderer.maxBounces
document.getElementById('numBouncesValue').textContent = renderer.maxBounces

document.getElementById('samplesPerPixel').value = renderer.samplesPerPixel
document.getElementById('samplesPerPixelValue').textContent = renderer.samplesPerPixel
let rendering = false;
let renderInterval;

let workers = [];
let numWorkers = navigator.hardwareConcurrency-2 || 4;
let prevPerformance, nowPerformance, prevRays = 0;
function initializeWorkers() {
    let startTime = performance.now();
    let getCount = 0;
    let totalRayCount = 0;
    for (let i = 0; i < numWorkers; i++) {
        let worker = new Worker('worker.js', { type: 'module' });

        worker.onmessage = function (e) {
            let { imageData, start, end, rayCount } = e.data;
            totalRayCount += rayCount
            ctx.putImageData(new ImageData(imageData, canvas.width, end - start), 0, start);
            getCount++;
            prevPerformance = nowPerformance;
            nowPerformance = performance.now()


            console.log(Math.round(((getCount) / numWorkers) * 100) + "%.. |", Math.trunc(nowPerformance - startTime), "ms (+", Math.trunc(nowPerformance - prevPerformance), "ms) |", nFormatter(totalRayCount), "rays (+", nFormatter(totalRayCount - prevRays), "rays)")
            prevRays = totalRayCount;
            prevPerformance = nowPerformance;
            //end of all cycles
            if (getCount == numWorkers) {
                let endTime = performance.now();
                let duration = endTime - startTime;
                workers.forEach((worker) => { worker.terminate(); workers = [] })

                console.log(`Render time: ${duration.toFixed(2)} ms | Total Trace calls: ${nFormatter(totalRayCount)} rays | ${nFormatter(totalRayCount / (duration / 1000.0))} Calls/s`);
            }

        };

        workers.push(worker);
    }
    distributeRendering()
}

function distributeRendering() {
    let width = canvas.width;
    let height = canvas.height;
    let chunkSize = Math.ceil(height / numWorkers);

    for (let i = 0; i < numWorkers; i++) {
        let start = i * chunkSize;
        let end = Math.min((i + 1) * chunkSize, height);
        workers[i].postMessage({
            start,
            end,
            width,
            height,
            renderer: getRendererData(),
            camera: camera.serialize(),
            scene: getSceneData(scene),
        });
    }

}

function parallelRender() {
    let width = canvas.width;
    let height = canvas.height;
    let imageData = ctx.createImageData(width, height);
    console.log("Rendering...   ==============================================================")
    initializeWorkers();

}

function render() {
    let width = canvas.width;
    let height = canvas.height;
    let imageData = ctx.createImageData(width, height);
    let data = imageData.data;
    let cameraControl = null
    let startTime = performance.now();
    console.log("Rendering...   ==============================================================")

    let ttt = new Vector(0, 0, 0);
    let lim = 1000
    let check = [-lim, lim, -lim, lim, -lim, lim];

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
                color = color.add(traceRay(ray, renderer.maxBounces, xSegment));
            }
            color = color.multiply(1 / (renderer.samplesPerPixel));

            let index = (y * width + x) * 4;
            data[index] = Math.sqrt(color.x) * 255;
            data[index + 1] = Math.sqrt(color.y) * 255;
            data[index + 2] = Math.sqrt(color.z) * 255;
            data[index + 3] = 255;

            //performance indicator t
            if (te != Math.floor(((y + 1) / height) * t)) {
                te = Math.floor(((y + 1) / height) * t)
                prevPerformance = nowPerformance;
                nowPerformance = performance.now()
                console.log(Math.round(((y + 1) / height) * 100) + "%.. |", Math.trunc(nowPerformance - startTime), "ms (+", Math.trunc(nowPerformance - prevPerformance), "ms) |", nFormatter(renderer.traceRayCount), "rays (+", nFormatter(renderer.traceRayCount - prevRays), "rays)")
                prevRays = renderer.traceRayCount;
                prevPerformance = nowPerformance;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    let endTime = performance.now();
    let duration = endTime - startTime;
    console.log(`Render time: ${duration.toFixed(2)} ms | Total Trace calls: ${nFormatter(renderer.traceRayCount)} | ${nFormatter(renderer.traceRayCount / (duration / 1000.0))} Calls/s`);
}

let prevTime = 3000

function startRendering() {
    renderer.resetTraceRay()
    if (rendering) return;
    rendering = true;
    if (renderer.renderOnce) {
        if (renderer.parallelProcessing) parallelRender()
        else {
            render();
        }
        rendering = false
    }
    else {
        // if (prevTime == 3000) { renderInterval = setInterval(render, 3000) }
        { renderInterval = setInterval(render, prevTime * 1.25) }
    }
}

function stopRendering() {
    console.log("resett")
    let imageData = ctx.createImageData(canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0)
    if (!rendering) return;
    rendering = false;
    clearInterval(renderInterval);
}

// function getCameraData(camera) {
//     return {
//         position: camera.position,
//         target: camera.target,
//         up: camera.up,
//         fov: camera.fov,
//         aspectRatio: camera.aspectRatio,
//         aperture: camera.aperture,
//         focusDistance: camera.focusDistance
//     };
// }

function getSceneData(scene) {
    return {
        lights: scene.lights,
        objects: scene.objects,
    }
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

    document.getElementById('debugMode').addEventListener('change', function () {
        renderer.setDebugMode(this.checked);
        if (renderer.debugMode) {
            renderer.setSamplesPerPixel(1);
            renderer.setNumBounces(2);
        };
        if (renderer.renderOnChange) render();
    });
    document.getElementById('parallelProcessing').addEventListener('change', function () {
        renderer.setParallelProcessing(this.checked);
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
    camera.update(canvas);
}

window.addEventListener('resize', resizeCanvas);
setupScene();
setupControls();
resizeCanvas();

