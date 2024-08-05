import { traceRay } from './renderer.js';
import { Camera, Sphere, Color, Vector } from './utils.js';
import { renderer } from './renderer-config.js';
function reconstructCamera(cameraData) {
    return new Camera(
        new Vector(cameraData.position.x, cameraData.position.y, cameraData.position.z),
        new Vector(cameraData.target.x, cameraData.target.y, cameraData.target.z),
        new Vector(cameraData.up.x, cameraData.up.y, cameraData.up.z),
        cameraData.fov,
        cameraData.canvasWidth,
        cameraData.canvasHeight,
    );
}

function reconstructScene(sceneData) {
    return {
        ...sceneData,
        intersect: function (ray) {
            let closestT = Infinity;
            let hitObject = null;
            let hitProperties = null;
            for (let obj of localScene.objects) {

                let hit = obj.intersect(ray);
                if (hit !== null && !objectCompare(ray.parentObj, hit.obj) && hit.hitDistance < closestT) {
                    closestT = hit.hitDistance;
                    hitObject = hit;
                    hitObject.hitProperties = hit;
                }
            }
            return hitObject;
        }
    }
}

self.onmessage = function (e) {
    const { start, end, width, height, camera, scene } = e.data;
    const rendererParams = e.data.renderer
    // console.log(renderer.maxBounces,"workerr")
    let localCamera = reconstructCamera(camera);
    let traceRayCount = 0;
    // let localScene = reconstructScene(scene);
    let { samplesPerPixel, maxBounces} = rendererParams;
    let imageData = new Uint8ClampedArray((end - start) * width * 4);
    for (let y = start; y < end; y++) {
        for (let x = 0; x < width; x++) {
            let u = x
            let v = height - y
            let color = new Vector(0, 0, 0);
            for (let s = 0; s < samplesPerPixel; s++) {
                let ray = localCamera.getRay(u, v);
                color = color.add(traceRay(ray, maxBounces));
            }
            color = color.multiply(1 / samplesPerPixel);
            // color = new Vector(Math.sqrt(color.x), Math.sqrt(color.y), Math.sqrt(color.z));
            let index = ((y - start) * width + x) * 4;
            imageData[index + 0] = Math.sqrt(color.x)*255;
            imageData[index + 1] = Math.sqrt(color.y)*255;
            imageData[index + 2] = Math.sqrt(color.z)*255;
            imageData[index + 3] = 255;
        }
    }

    let rayCount = renderer.traceRayCount
    self.postMessage({ imageData, start, end,rayCount });
    // self.postMessage("gello")
};
