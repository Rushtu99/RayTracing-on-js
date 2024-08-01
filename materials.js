import { Vector, Ray } from "./utils.js";
import { getUnitNormalVector } from './utilFunctions.js'

export class Material {
    constructor(color, emissiveColor = new Vector(0, 0, 0), roughness = 0, metallic = 0) {
        this.color = color;
        this.emissiveColor = emissiveColor;
        this.roughness = roughness;
        this.metallic = metallic;
    }
    scatteredRay() {
        return null;
    }
    getColor() {
        return this.color
    }
}
export class DiffusedMaterial extends Material {
    constructor(color, emissiveColor = new Vector(0, 0, 0), roughness = 0, metallic = 0) {
        super(color, emissiveColor, roughness, metallic)
    }

    scatteredRay(ray, hit) {
        let seed = getUnitNormalVector().add(hit.normal).normalize()
        return new Ray(hit.point, seed, hit.obj); // To be implemented
    }
}

export class ReflectedMaterial extends Material {
    constructor(color, emissiveColor = new Vector(0, 0, 0), roughness = 0, metallic = 0) {
        super(color, emissiveColor, roughness, metallic)

    }
    scatteredRay(ray, hit) {
        let fuzzyFactor = 0.01;
        let normal = getUnitNormalVector().multiply(fuzzyFactor).add(hit.normal);
        let direction = ray.direction.subtract(normal.multiply(2 * ray.direction.dot(normal)));
        return new Ray(hit.point, direction, hit.obj);
    }
}

export class RefractedMaterial extends Material {
    constructor(color, emissiveColor = new Vector(0, 0, 0), roughness = 0, metallic = 0) {
        super(color, emissiveColor, roughness, metallic)

    }
    // scatteredRay(ray, hit,etai_over_etat) {
    //     let front_face = ray.direction().dot(normal) < 0;
    // //     attenuation = color(1.0, 1.0, 1.0);
    //     let ri = hit.front_face ? (1.0/refraction_index) : refraction_index;

    //     let unit_direction = unit_vector(r_in.direction());
    //     let refracted = refract(unit_direction, rec.normal, ri);

    // }
}

export class EmmisiveMaterial extends Material {
    constructor(color, emissiveColor = new Vector(0, 0, 0), roughness = 0, metallic = 0) {
        super(color, emissiveColor, roughness, metallic)
    }
    scatteredRay(ray, hit) {
        return null;
    }
}

