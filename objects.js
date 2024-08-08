import { Vector, Hit } from "./utils.js";
export class Sphere {
    constructor(center, radius, material, checkered = false) {
        this.center = center;
        this.radius = radius;
        this.material = material;
        // this.check = [-this.lim, this.lim, -this.lim, this.lim, -this.lim / 10000000, this.lim / 1000000];
        this.checkered = checkered

        //  this.lim = 1
        // this.check = [-this.lim, this.lim, -this.lim, this.lim, -this.lim/10000000, this.lim/1000000];
    }

    color(hit) {
        // return hit.normal.add(new Vector(1, 1, 1)).multiply(0.5)
        if (!this.checkered) return this.material.color
        let inv_scale = 0.04;

        let xInteger = (Math.floor(inv_scale * hit.point.x));
        let yInteger = (Math.floor(inv_scale * hit.point.y));
        let zInteger = (Math.floor(inv_scale * hit.point.z));

        let isEven = (xInteger + yInteger + zInteger) % 2 == 0;
        if (isEven) return new Vector(0.5, 0.5, 0.5)
        return this.material.color
    }

    intersect(ray) {
        // if (temp != ray ) {
        //     temp = ray
        //     console.log("CCCCC", ray)
        // }
        if (Object.is(ray.parentObj, this)) {
            return null;
        }
        const oc = this.center.subtract(ray.origin);
        const a = ray.direction.dot(ray.direction);
        const b = -2.0 * oc.dot(ray.direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const discriminant = b * b - 4 * a * c;
        if (discriminant > 0 && (ray.origin.subtract(this.center).length() >= this.radius)) {
            const sqrtDiscriminant = Math.sqrt(discriminant);
            const t = (-b - sqrtDiscriminant) / (2.0 * a);
            // const t2 = (-b + sqrtDiscriminant) / (2.0 * a);
            if (t > 0.0001) {
                // const t = t1 < t2 ? t1 : t2; // Return the closest intersection point
                const hitPoint = ray.origin.add(ray.direction.multiply(t));
                const normal = hitPoint.subtract(this.center).normalize()
                return new Hit(hitPoint, ray, t, this, normal);
            }
        }
        return null; // No intersection
    }
}

export class Triangle {
    constructor(v0, v1, v2, n, material, mesh) {
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
        this.normal = n;
        this.material = material;
        this.mesh = mesh
    }
    color(hit) {
        // return hit.normal.add(new Vector(1, 1, 1)).multiply(0.5)
        return this.material.color
    }

    intersect(ray) {
        const edge1 = this.v1.subtract(this.v0);
        const edge2 = this.v2.subtract(this.v0);
        const h = ray.direction.cross(edge2);
        const a = edge1.dot(h);
        if (a > -0.00001 && a < 0.00001) return null;
        const f = 1.0 / a;
        const s = ray.origin.subtract(this.v0);
        const u = f * s.dot(h);
        if (u < 0.0 || u > 1.0) return null;
        const q = s.cross(edge1);
        const v = f * ray.direction.dot(q);
        if (v < 0.0 || u + v > 1.0) return null;
        const t = f * edge2.dot(q);
        if (t > 0.01) {
            const hitPoint = ray.origin.add(ray.direction.multiply(t));
            return new Hit(hitPoint, ray, t, this, this.normal);
        }
        return null;
    }
}

export class Mesh {
    constructor() {
        this.triangles = [];
    }

    addTriangle(triangle) {
        this.triangles.push(triangle);
    }

    intersect(ray) {
        // console.log("mesh.intersect")

        let closestHit = null;
        for (const triangle of this.triangles) {
            const hit = triangle.intersect(ray);
            if (hit && (!closestHit || hit.hitDistance < closestHit.hitDistance)) {
                closestHit = hit;
            }
        }
        return closestHit;
    }
}
