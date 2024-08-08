import { Vector, Ray } from "./utils.js";
import { getUnitNormalVector } from './utilFunctions.js'

export class Material {
    constructor(color, emissiveColor = new Vector(0, 0, 0)) {
        this.color = color;
        this.emissiveColor = emissiveColor;
    }
    scatteredRay() {
        return null;
    }
    getColor() {
        return this.color
    }
}
export class DiffusedMaterial extends Material {
    constructor(color, emissiveColor = new Vector(0, 0, 0)) {
        super(color, emissiveColor)
    }

    scatteredRay(ray, hit) {
        // console.log("Scattering",hit)
        let seed = getUnitNormalVector().add(hit.normal).normalize()
        return new Ray(hit.point.add(hit.normal.multiply(0.01)), seed, hit.obj); // To be implemented
    }
}

export class ReflectedMaterial extends Material {
    constructor(color, fuzzyFactor= 0.01, emissiveColor = new Vector(0, 0, 0)) {
        super(color, emissiveColor)
        this.fuzzyFactor = fuzzyFactor;
    }

    scatteredRay(ray, hit) {
        let normal = getUnitNormalVector().multiply(this.fuzzyFactor).add(hit.normal);
        let direction = ray.direction.subtract(normal.multiply(2 * ray.direction.dot(normal)));
        return new Ray(hit.point.add(hit.normal.multiply(0.01)), direction, hit.obj);
    }
}

export class RefractedMaterial extends Material {
    constructor(color, refraction_index, emissiveColor = new Vector(0, 0, 0)) {
        super(new Vector(1, 1, 1), emissiveColor)
        this.refraction_index = refraction_index

    }

    scatteredRay(ray, hit) {
        let in_d = hit.normal.dot(ray.direction)
        let ri = in_d >= 0 ? (1.0 / this.refraction_index) : this.refraction_index;

        let cos_theta = Math.min(-1 * in_d, 1.0);
        let sin_theta = Math.sqrt(1.0 - cos_theta * cos_theta);
        let cannot_refract = ri * sin_theta >= 1.0;


        if (cannot_refract || this.reflectance(cos_theta, ri) > Math.random()) {
            let r_out_perp = (ray.direction.add(hit.normal.multiply(cos_theta))).multiply(ri);
            let r_out_parallel = hit.normal.multiply(-Math.sqrt(Math.abs(1 - r_out_perp.length() ** 2)));
            return new Ray(hit.point.add(hit.normal.multiply(0.01)), r_out_perp.add(r_out_parallel), hit.obj);
        }
        else {
            let fuzzyFactor = 0.01;
            let normal = getUnitNormalVector().multiply(fuzzyFactor).add(hit.normal);
            let direction = ray.direction.subtract(normal.multiply(2 * ray.direction.dot(normal)));
            return new Ray(hit.point.add(hit.normal.multiply(0.01)), direction, hit.obj);
        }
    }

    reflectance(cosine, refraction_index) {
        // Use Schlick's approximation for reflectance.
        let r0 = (1 - refraction_index) / (1 + refraction_index);
        r0 = r0 * r0;
        return r0 + (1 - r0) * Math.pow((1 - cosine), 5);
    }
}

export class EmmisiveMaterial extends Material {
    constructor(color, emissiveColor = new Vector(0, 0, 0)) {
        super(color, emissiveColor)
    }
    scatteredRay(ray, hit) {
        return null;
    }
}

