// Vector class for 3D math operations
export class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.len = -1;
        // this.length();
    }
    clone() {
        return new Vector(this.x, this.y, this.z)
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
    multiColor(v) {
        return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
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
        if (this.len === -1) {

            this.len = Math.sqrt(this.x * this.x +
                this.y * this.y +
                this.z * this.z);
        }
        this.lengthCount++;
        return this.len;
    }

    normalize() {
        // if (normalCount % 10000 == 0) console.log(normalCount)
        // normalCount++
        let len = this.length();
        return new Vector(this.x / len, this.y / len, this.z / len);
    }

    scale(minFrom, maxFrom, minTo, maxTo) {
        let a = (maxTo - minTo) / (maxFrom - minFrom)
        let b = minFrom
        return new Vector((this.x - (b)) * a + minTo, (this.y - (b)) * a + minTo, (this.z - (b)) * a + minTo)
    }

}

export class Hit {
    constructor(point, ray, hitDistance, obj) {
        this.point = point;
        this.obj = obj;
        this.ray = ray;
        this.hitDistance = hitDistance
        this.normal = this.point.subtract(obj.center).normalize();
    }
}

// Ray class
export class Ray {
    constructor(origin, direction, parentObj) {
        this.origin = origin;
        this.parentObj = parentObj;
        this.direction = direction;
    }
}

export function Color(x, y, z) {
    return new Vector(x / 255.0, y / 255.0, z / 255.0)
}

export class Sphere {
    constructor(center, radius, material, checkered = false) {
        this.center = center;
        this.radius = radius;
        this.material = material;
        this.check = [-this.lim, this.lim, -this.lim, this.lim, -this.lim / 10000000, this.lim / 1000000];
        this.checkered = checkered

        //  this.lim = 1
        // this.check = [-this.lim, this.lim, -this.lim, this.lim, -this.lim/10000000, this.lim/1000000];
    }

    color(hit) {
        // return hit.normal.add(new Vector(1, 1, 1)).multiply(0.5)
        return this.material.getColor(hit)
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
        const oc = this.center.subtract(ray.origin);
        const a = ray.direction.dot(ray.direction);
        const b = -2.0 * oc.dot(ray.direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const discriminant = b * b - 4 * a * c;
        if (discriminant > 0 && (ray.origin.subtract(this.center).length() >= this.radius)) {
            const sqrtDiscriminant = Math.sqrt(discriminant);
            const t = (-b - sqrtDiscriminant) / (2.0 * a);
            // const t2 = (-b + sqrtDiscriminant) / (2.0 * a);
            if (t > 0) {
                // const t = t1 < t2 ? t1 : t2; // Return the closest intersection point
                const hitPoint = ray.origin.add(ray.direction.multiply(t));
                return new Hit(hitPoint, ray, t, this);
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
        this.canvasHeight = -1
        this.canvasWidth = -1


        // this.lim = 1
        // this.check = [-this.lim, this.lim, -this.lim, this.lim, -this.lim/10000000, this.lim/1000000];

    }

    update() {
        // let theta = (;
        // let h = Math.tan(theta/2);
        // let viewport_height = 2 * h * focal_length;


        this.w = this.target.subtract(this.position).normalize();
        this.u = this.up.cross(this.w).normalize();
        this.v = this.w.cross(this.u).normalize();
        this.viewportHeight = Math.tan(this.fov / 2);
        this.viewportWidth = this.viewportHeight * this.aspectRatio;
        this.canvasHeight = canvas.height
        this.canvasWidth = canvas.width

    }

    getRay(x, y) {
        let offset = new Vector(Math.random() - 0.5, Math.random() - 0.5, 0).multiply(1);
        let u = ((x - offset.x) / this.canvasWidth) * 2 - 1;
        let v = ((y - offset.y) / this.canvasHeight) * 2 - 1;
        let direction = this.u.multiply(u * this.viewportWidth).add(
            this.v.multiply(v * this.viewportHeight)).add(this.w);
        let ray = new Ray(this.position, direction, this);

        //min max inspector
        // let temp = direction
        // if (temp.x > this.check[0]) this.check[0] = temp.x
        // if (temp.x < this.check[1]) this.check[1] = temp.x
        // if (temp.y > this.check[2]) this.check[2] = temp.y
        // if (temp.y < this.check[3]) this.check[3] = temp.y
        // if (temp.z > this.check[4]) this.check[4] = temp.z
        // if (temp.z < this.check[5]) this.check[5] = temp.z
        // console.log(temp)
        // console.log("x :" + this.check[1] + " to " + this.check[0])
        // console.log("y :" + this.check[3] + " to " + this.check[2])
        // console.log("z :" + this.check[5] + " to " + this.check[4])

        return ray
    }
}
