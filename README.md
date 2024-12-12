# Ray Tracing Engine

This project implements a ray tracing engine in JavaScript, featuring realistic rendering techniques including BRDF (Bidirectional Reflectance Distribution Function), emissive materials, metallic materials, and orbit camera controls. The engine also includes a control panel for adjusting various rendering parameters and showcases a scene with multiple spheres to demonstrate different material properties.

deployed on: https://rushtu99.github.io/RayTracing-on-js/

## Features and Code Flow

### 1. Scene Setup
- **File**: `scene-config.js`
- **Key Functions**:
  - `setupScene()`: Initializes the camera and creates scene objects.
  - `scene.add()`: Adds objects to the scene.
  - `scene.intersect()`: Checks for ray intersections with scene objects.

### 2. Ray Tracing
- **File**: `main.js`
- **Key Functions**:
  - `render()`: Iterates over each pixel, creating rays and accumulating color.
  - `traceRay()`: Traces a ray through the scene, handling bounces and material interactions.
- **Process**:
  1. For each pixel, create a ray from the camera.
  2. Call `traceRay()` to determine the color for that pixel.
  3. Accumulate colors if enabled for noise reduction.

### 3. Material Handling
- **File**: `materials.js`
- **Classes**: `ReflectedMaterial`, `DiffusedMaterial`, `EmmisiveMaterial`, `RefractedMaterial`
- **Process**: Each material class defines how light interacts with the surface, including reflection, diffusion, emission, and refraction.

### 4. Geometric Primitives
- **File**: `objects.js`
- **Classes**: `Sphere` (and potentially other shapes)
- **Key Methods**: `intersect()`: Calculates ray intersections with the object.

### 5. Camera and Ray Generation
- **File**: `camera.js`
- **Class**: `Camera`
- **Key Methods**:
  - `getRay()`: Generates a ray for a given pixel.
  - `orbit()`: Handles camera movement for interactive viewing.

### 6. Utility Functions
- **File**: `utils.js`
- **Classes**: `Vector`, `Ray`
- **Functions**: Mathematical operations for vectors, colors, and other utilities.

### 7. Parallel Processing
- **File**: `main.js`
- **Functions**:
  - `initializeWorkers()`: Sets up Web Workers for parallel rendering.
  - `distributeRendering()`: Divides the rendering task among workers.
  - `parallelRender()`: Initiates parallel rendering process.

### 8. User Interface and Controls
- **File**: `main.js`
- **Functions**:
  - Event listeners for UI controls (sliders, checkboxes).
  - `startRendering()`, `stopRendering()`: Control the rendering process.

### 9. Performance Monitoring
- **File**: `main.js`
- **Process**: Logs rendering time, ray count, and rays per second for performance analysis.

## Rendering Process Flow

1. **Initialization**:
   - Set up the scene, camera, and UI controls.
   - Initialize rendering parameters.

2. **Render Loop**:
   - For each pixel:
     a. Generate a ray from the camera.
     b. Trace the ray through the scene.
     c. Calculate color based on material interactions.
     d. Accumulate color samples if enabled.

3. **Ray Tracing**:
   - Check for intersections with scene objects.
   - Handle reflections, refractions, and emissions based on material properties.
   - Implement depth-of-field effects if enabled.

4. **Parallel Processing** (if enabled):
   - Divide the image into chunks.
   - Distribute chunks to Web Workers.
   - Combine results from all workers.

5. **Post-Processing**:
   - Apply gamma correction.
   - Update the canvas with the rendered image.

6. **User Interaction**:
   - Handle camera movements.
   - Update rendering parameters based on UI controls.
   - Re-render the scene when changes occur.

This ray tracing engine combines various components to create a flexible and interactive rendering system, capable of producing realistic images with a variety of material types and lighting conditions.
