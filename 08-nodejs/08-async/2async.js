const fs = require("fs");
const promisefy = require("util").promisify;

// 返回promise对象
let readFile = promisefy(fs.readFile);
async function run() {
  let r1 = await readFile("./1.txt", "utf8");
  let r2 = await readFile("./2.txt", "utf8");
  let r3 = await readFile("./3.txt", "utf8");
  console.log(r1, r2, r3);
}
