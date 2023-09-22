let a = 10;
let b = 20;

function show() {
  console.log("show");
}
// 默认导出，只能有一个
export default {a, b, show}


// 按需导出
let c = 30
let d = 40
export {c,d}