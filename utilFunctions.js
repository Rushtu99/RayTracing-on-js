import { Vector } from "./utils.js";

export function objectCompare(a, b) {
  return Object.is(a, b);
}

export function roundedTo(num,factor){
  return (Math.round(num*factor))/factor;
}

export function Color(x, y, z) {
  return new Vector(x / 255.0, y / 255.0, z / 255.0)
}

export function getUnitNormalVector(constX = [-1.1], constY = [-1, 1], constZ = [-1, 1]) {
  return (new Vector(Math.random(), Math.random(), Math.random()).normalize());
}

export function nFormatter(num, digits = 2) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup.findLast(item => num >= item.value);
  return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
}

export function randRange(min,max){
    return Math.random()*(max-min)+min;
}
