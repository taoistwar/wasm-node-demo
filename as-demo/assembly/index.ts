// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export class Param {
  constructor(public a: i32, public b: i32) {}
}

export function sub(param: Param): i32 {
  return param.a - param.b;
}
