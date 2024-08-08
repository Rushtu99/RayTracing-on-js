import { Vector, Ray } from "./utils.js";
export class Camera {
    constructor(position, target, up, fov, canvasWidth, canvasHeight) {
        this.position = position;
        this.target = target;
        this.up = up;
        this.fov = fov;
        this.aspectRatio = canvasWidth / canvasHeight;
        this.canvasHeight = canvasHeight
        this.canvasWidth = canvasWidth
        this.w = this.target.subtract(this.position).normalize();
        this.u = this.up.cross(this.w).normalize();
        this.v = this.w.cross(this.u).normalize();
        this.viewportHeight = Math.tan(this.fov / 2);
        this.viewportWidth = this.viewportHeight * this.aspectRatio;
        // this.lim = 1
        // this.check = [-this.lim, this.lim, -this.lim, this.lim, -this.lim/10000000, this.lim/1000000];

    }

    update(canvas) {
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
    serialize() {
        return {
            position: this.position,
            target: this.target,
            up: this.up,
            fov: this.fov,
            aspectRatio: this.aspectRatio,
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight
        };
    }
}