import { Vector } from "./utils.js";

export function objectCompare(a, b) {
    return Object.is(a, b);
}

export function getUnitNormalVector(constX = [-1.1], constY = [-1, 1], constZ = [-1, 1]) {
    return (new Vector(Math.random(), Math.random(), Math.random()).normalize());
}
