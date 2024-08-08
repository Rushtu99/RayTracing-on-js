// Vector class for 3D math operations
import { roundedTo } from "./utilFunctions.js";
let factor = 1000;
export class Vector {
    constructor(x, y, z) {
        if(typeof(x)!='number')console.log("boom")
        this.x = (x);
        this.y = (y);
        this.z = (z);
        this.len = -1;
        this.lengthCount = 0;
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

    // toFixed(t = 4){
    //     this.x.toFixed(t)
    //     this.y.toFixed(t)
    //     this.z.toFixed(t)
    // }

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
        let len = this.length();
        return new Vector(this.x / len, this.y / len, this.z / len);
    }

    scale(minFrom, maxFrom, minTo, maxTo) {
        let a = (maxTo - minTo) / (maxFrom - minFrom)
        let b = minFrom
        return new Vector((this.x - (b)) * a + minTo, (this.y - (b)) * a + minTo, (this.z - (b)) * a + minTo)
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
export class Hit {
    constructor(point, ray, hitDistance, obj, normal) {
        this.point = point;
        this.obj = obj;
        this.ray = ray;
        this.hitDistance = hitDistance
        this.normal = normal;
    }
}


