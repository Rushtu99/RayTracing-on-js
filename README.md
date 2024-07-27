# Ray Tracing Engine

This project implements a ray tracing engine in JavaScript, featuring realistic rendering techniques including BRDF (Bidirectional Reflectance Distribution Function), emissive materials, metallic materials, and orbit camera controls. The engine also includes a control panel for adjusting various rendering parameters and showcases a scene with multiple spheres to demonstrate different material properties.

## Features

- **Ray Tracing**: Compute pixel colors by tracing rays through a scene.
- **Realistic BRDF**: Model realistic surface interactions with properties such as diffuse, specular, roughness, and metallicity.
- **Emissive Materials**: Support for materials that emit light.
- **Orbit Camera Controls**: Interactive camera movement around the scene.
- **Accumulation**: Accumulate render results to reduce noise.
- **Dynamic Scene**: Includes multiple spheres with different material properties.
- **Control Panel**: Adjustable sliders, inputs, and checkboxes for interactive control.

## Files

### `index.html`
Sets up the canvas and control panel, including links to JavaScript files and CSS.

### `styles.css`
CSS file for styling the canvas, control panel, and general layout.

### `utils.js`
Contains utility functions and classes:
- `Vector`: Basic vector operations, including addition, subtraction, dot product, cross product, normalization, and length calculation.
- `Ray`: Represents a ray with an origin and direction.
- `Material`: Represents material properties such as color, emissive color, roughness, and metallicity.
- `Camera`: Represents the camera with methods for orbit control and view/projection matrix calculations.

### `renderer.js`
Handles the rendering logic:
- `traceRay()`: Traces a ray through the scene and computes the color at the intersection point.

### `main.js`
Main JavaScript file that initializes the scene, handles rendering, and manages orbit camera controls. Features:
- Initialization of canvas and camera.
- Scene setup with multiple spheres.
- Rendering logic supporting accumulation and multiple samples per pixel.
- Orbit controls for interactive camera movement.
- Event listeners for window resizing and control panel interactions.

## Function Call Flow

Here is an overview of the function call flow for rendering an image:

1. **Initialization**:
   - `main.js`: Initializes the `Camera`, `Scene`, and sets up the canvas.
   - `main.js`: Event listeners for resizing and user interactions are set up.

2. **Rendering**:
   - `main.js`: Calls `render()` to start the rendering process.
   - `main.js -> render()`: Clears the canvas and iterates over each pixel.
     - For each pixel:
       - `main.js -> render() -> traceRay()`: Creates a `Ray` from the camera and pixel position.
       - `renderer.js -> traceRay()`: 
         - Checks for intersections with objects in the scene.
         - Calculates color based on intersection and material properties.
         - Handles multiple bounces if reflections are enabled.
       - `main.js -> render()`: Accumulates color values if the accumulate checkbox is checked.

3. **Camera Controls**:
   - `main.js`: Listens for drag events on the canvas.
   - `main.js -> canvas.addEventListener('mousemove')`: Updates the camera's position and orientation using `Camera.orbit()`.
   - `Camera.orbit()`: Calculates new camera position and updates the view matrix.
   - `main.js -> render()`: Rerenders the scene after updating the camera position.

4. **Window Resizing**:
   - `main.js -> window.addEventListener('resize')`: Adjusts the canvas size and updates the camera aspect ratio.
   - `main.js -> render()`: Rerenders the scene with the updated canvas size and aspect ratio.

## Example Scene

The scene includes five spheres with various material properties:
- **Red Sphere**: Diffuse material.
- **Green Sphere**: Reflective material.
- **Blue Sphere**: Dielectric material with a glossy finish.
- **White Sphere**: High roughness and metallicity.
- **Yellow Sphere**: Fully metallic material.
