// src/renderer-config.js
export let renderer = {
    samplesPerPixel: 15,
    maxBounces: 5,
    bouncedRays: 1,
    brdf: 'phong',
    depthOfField: false,
    debugMode: false,
    accumulate: false,
    renderOnce: true,
    renderOnChange: false,
    parallelProcessing: false,
    skyLight: false,
    traceRayCount: 0,

    resetTraceRay: function () { this.traceRayCount = 0; this.update() },
    incTraceRay: function () { this.traceRayCount++ },
    setSamplesPerPixel: function (value) { this.samplesPerPixel = value; this.update() },
    setNumBounces: function (value) { this.maxBounces = value; this.update() },
    setDebugMode: function (value) { this.debugMode = value; this.update() },
    setSkyLight: function (value) { this.skyLight = value; this.update() },
    setRenderOnChange: function (value) { this.renderOnChange = value; this.update() },
    setParallelProcessing: function (value) { this.parallelProcessing = value; this.update() },
    setAccumulate: function (value) { this.accumulate = value; this.update() },
    setRenderOnce: function (value) { this.renderOnce = value; this.update() },

    setBRDF: function (value) { this.brdf = value; this.update() },
    setDepthOfField: function (value) { this.depthOfField = value; this.update() },
    update: function () {
        document.getElementById('numBounces').value = renderer.maxBounces;
        document.getElementById('numBouncesValue').textContent = renderer.maxBounces;
        document.getElementById('samplesPerPixel').value = renderer.samplesPerPixel;
        document.getElementById('samplesPerPixelValue').textContent = renderer.samplesPerPixel;
    }
};

export function getRendererData() {
    return {
        samplesPerPixel: renderer.samplesPerPixel,
        maxBounces: renderer.maxBounces,
        brdf: renderer.brdf,
        depthOfField: renderer.depthOfField,
        debugMode: renderer.debugMode,
        accumulate: renderer.accumulate,
        renderOnce: renderer.renderOnce,
        renderOnChange: renderer.renderOnChange,
        skyLight: renderer.skyLight,
        traceRayCount:renderer.traceRayCount
    };
}