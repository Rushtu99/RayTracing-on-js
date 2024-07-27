// Vector class for 3D math operations
export class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    normalize() {
        let len = this.length();
        return new Vector(this.x / len, this.y / len, this.z / len);
    }
}

// Ray class
export class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction.normalize();
    }
}

// Material class
export class Material {
    constructor(color, emissiveColor = new Vector(0, 0, 0), roughness = 0, metallic = 0) {
        this.color = color;
        this.emissiveColor = emissiveColor;
        this.roughness = roughness;
        this.metallic = metallic;
    }
}

export class Sphere {
    constructor(center, radius, material) {
        this.center = center;
        this.radius = radius;
        this.material = material;
    }

    intersect(ray) {
        const oc = this.center.subtract(ray.origin);
        const a = ray.direction.dot(ray.direction);
        const b = 2.0 * oc.dot(ray.direction);
        const f = ray.direction.dot(oc)
        const c = oc.dot(oc) - this.radius * this.radius;
        const discriminant = b * b - 4 * a * c;
        if (discriminant > 0 && ray.direction.dot(oc) <= 0) {
            const sqrtDiscriminant = Math.sqrt(discriminant);
            const t1 = (-b - sqrtDiscriminant) / (2.0 * a);
            const t2 = (-b + sqrtDiscriminant) / (2.0 * a);

            if (t1 > 0 || t2 > 0) {
                const t = t1 < t2 ? t1 : t2; // Return the closest intersection point
                const hitPoint = ray.origin.add(ray.direction.multiply(t));
                const normal = hitPoint.subtract(this.center).normalize();

                return { point: hitPoint, normal: normal, hitDistance: t, material: this.material };
            }
        }
        return null; // No intersection
    }
}

// Camera class
export class Camera {
    constructor(position, target, up, fov, aspectRatio) {
        this.position = position;
        this.target = target;
        this.up = up;
        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.update();
    }

    update() {
        this.w = this.position.subtract(this.target).normalize();
        this.u = this.up.cross(this.w).normalize();
        this.v = this.w.cross(this.u).normalize();
        this.viewportHeight = Math.tan(this.fov / 2);
        this.viewportWidth = this.viewportHeight * this.aspectRatio;
    }

    getRay(x, y) {
        let u = (x / canvas.width) * 2 - 1;
        let v = (y / canvas.height) * 2 - 1;
        let direction = this.u.multiply(u * this.viewportWidth).add(
            this.v.multiply(v * this.viewportHeight)).add(this.w);
        return new Ray(this.position, direction);
    }
}
