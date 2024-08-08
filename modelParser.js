import { Triangle, Mesh } from "./objects.js";
import { Vector } from "./utils.js";
import { scene, } from "./scene-config.js";
import { ReflectedMaterial } from './materials.js'
// Function to parse OBJ file content


async function parse(data) {
    let vertices = []
    let textureCoords = []
    let normals = []
    let faces = []
    const lines = data.split('\n');
    for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const type = parts[0];

        switch (type) {
            case 'v':
                vertices.push(parts.slice(1).map(Number));
                break;
            case 'vt':
                textureCoords.push(parts.slice(1).map(Number));
                break;
            case 'vn':
                normals.push(parts.slice(1).map(Number));
                break;
            case 'f':
                faces.push(await parseFace(parts.slice(1)));
                break;
            // Add more cases as needed (e.g., for groups, materials)
        }
    }
    return { vertices, textureCoords, normals, faces };
}
async function parseFace(faceParts) {
    return faceParts.map(part => {
        const indices = part.split('/').map(Number);
        return {
            vertexIndex: indices[0] - 1, // OBJ indices are 1-based
            textureIndex: indices[1] ? indices[1] - 1 : null,
            normalIndex: indices[2] ? indices[2] - 1 : null,
        };
    });
}

// Example Usage
const objData = `
v 0.123 0.234 0.345
v 0.456 0.567 0.678
vt 0.500 1.000
vn 0.0 0.0 1.0
f 1/1/1 2/1/1
`;


// console.log(parsedData);


export function createMeshFromOBJ(objData, material) {
    const { vertices, normals, faces } = objData;
    const mesh = new Mesh();
    for (const face of faces) {
        // Assuming each face is a quad for this example; adjust if needed
        if (face.length === 4) {
            const [f0, f1, f2, f3] = face;
            const v0 = new Vector(Number(vertices[f0.vertexIndex][0].toFixed(4)), Number(vertices[f0.vertexIndex][1].toFixed(4)), Number(vertices[f0.vertexIndex][2].toFixed(4)));
            const v1 = new Vector(Number(vertices[f1.vertexIndex][0].toFixed(4)), Number(vertices[f1.vertexIndex][1].toFixed(4)), Number(vertices[f1.vertexIndex][2].toFixed(4)));
            const v2 = new Vector(Number(vertices[f2.vertexIndex][0].toFixed(4)), Number(vertices[f2.vertexIndex][1].toFixed(4)), Number(vertices[f2.vertexIndex][2].toFixed(4)));
            const v3 = new Vector(Number(vertices[f3.vertexIndex][0].toFixed(4)), Number(vertices[f3.vertexIndex][1].toFixed(4)), Number(vertices[f3.vertexIndex][2].toFixed(4)));

            const n = new Vector(Number(normals[f0.normalIndex][0].toFixed(4)), Number(normals[f0.normalIndex][1].toFixed(4)), Number(normals[f0.normalIndex][2].toFixed(4)));

            // Create two triangles for the quad
            mesh.addTriangle(new Triangle(v0, v1, v2, n, material, mesh));
            mesh.addTriangle(new Triangle(v2, v3, v0, n, material, mesh));
        } else if (face.length === 3) {
            const [f0, f1, f2] = face;
            const v0 = new Vector(Number(vertices[f0.vertexIndex][0].toFixed(4)), Number(vertices[f0.vertexIndex][1].toFixed(4)), Number(vertices[f0.vertexIndex][2].toFixed(4)));
            const v1 = new Vector(Number(vertices[f1.vertexIndex][0].toFixed(4)), Number(vertices[f1.vertexIndex][1].toFixed(4)), Number(vertices[f1.vertexIndex][2].toFixed(4)));
            const v2 = new Vector(Number(vertices[f2.vertexIndex][0].toFixed(4)), Number(vertices[f2.vertexIndex][1].toFixed(4)), Number(vertices[f2.vertexIndex][2].toFixed(4)));
            const n = new Vector(Number(normals[f0.normalIndex][0].toFixed(4)), Number(normals[f0.normalIndex][1].toFixed(4)), Number(normals[f0.normalIndex][2].toFixed(4)));
            mesh.addTriangle(new Triangle(v0, v1, v2, n.normalize(), material, mesh));
        }
    }
    return mesh;
}

export async function loadOBJModels(url) {
    console.log("Loading")
    let meshes = []
    for (let i = 0; i < url.length; i++) {
        try {
            const response = await fetch(url[i]);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const objDataText = await response.text();
            const objData = await parse(objDataText);
            meshes.push(createMeshFromOBJ(objData, new ReflectedMaterial(new Vector(0.5, 1, 0.2), 0.01)));
        } catch (error) {
            console.error('Failed to load the OBJ file:', error);
        }
    }
    scene.add(meshes)
    console.log("Loading DOne", meshes)
    return meshes
}
