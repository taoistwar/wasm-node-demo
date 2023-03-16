import fs from 'node:fs';
import path from 'node:path';

function loadWasm(filePath: string): any {
  const wasmFile = fs.readFileSync(filePath);
  const wasm = new WebAssembly.Module(wasmFile);
  return new WebAssembly.Instance(wasm, {
    env: {
      memoryBase: 0,
      tableBase: 0,
      memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
      table: new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
      abort: console.log
    }
  }).exports;
}

const filePath = path.join(__dirname, '../../as-demo/build/release.wasm');

const mod = loadWasm(filePath);
if (mod) {
  let add = (mod as any)?.add;
  if (add) {
    const result = add(40, 3);
    console.log(result);
  }
  // 下面代码执行中会出错，因为 wasm 只支持 4 种数值类型:i32、i64、f32、f64。
  // 所以，wasm 更适合通过ID传参数，插件接收ID后，从第三方库（如：Redis、MySQL）中获取？
  try {
    let sub = (mod as any)?.sub;
    if (sub) {
      const result = sub({ a: 40, b: 3 });
      console.log(result);
    }
  } catch (err: any) {
    console.log('execute wasm error:');
  }
}
