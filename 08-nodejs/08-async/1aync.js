const fs = require("fs");
// 异步编程
// // 回调函数，回调地狱
// fs.readFile("1.txt", "utf8", (err, doc) => {
//   fs.readFile("2.txt", "utf8", (err, doc) => {
//     fs.readFile("3.txt", "utf8", (err, doc) => {
//       fs.readFile("4.txt", "utf8", (err, doc) => {});
//     });
//   });
// });

// promise

// let promise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     if (true) {
//       resolve({ age: 12 });
//     } else {
//       reject("error");
//     }
//   }, 2000);
// });
// promise
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {});

// 解决回调地狱
function p1() {
  return new Promise((resolve, reject) => {
    fs.readFile("./1.txt", "utf8", (err, doc) => {
      if (err) {
        reject("读取失败");
      } else {
        resolve(doc);
      }
    });
  });
}
function p2() {
  return new Promise((resolve, reject) => {
    fs.readFile("./2.txt", "utf8", (err, doc) => {
      if (err) {
        reject("读取失败");
      } else {
        resolve(doc);
      }
    });
  });
}
function p3() {
  return new Promise((resolve, reject) => {
    fs.readFile("./3.txt", "utf8", (err, doc) => {
      if (err) {
        reject("读取失败");
      } else {
        resolve(doc);
      }
    });
  });
}
p1()
  .then((r1) => {
    console.log(r1);
    return p2();
  })
  .then((r2) => {
    console.log(r2);
    return p3();
  })
  .then((r3) => {
    console.log(r3);
  })
  .catch((error) => {
    console.log(error);
  });

//异步函数 ，异步编程的终极解决方案，以同步方式编写异步代码，在函数前面加上async，即可让函数编程异步函数
// 使用return进行数据传递
// 使用throw进行错误抛出
async function fn() {
  if (false) {
    throw "error";
  }

  return "222";
}
console.log(fn());
fn()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

// 顺序执行
async function a() {
  return "a";
}
async function b() {
  return "b";
}
async function c() {
  return "c";
}
async function run() {
  let r1 = await a();
  let r2 = await b();
  let r3 = await c();
  console.log(r1, r2, r3);
}
run();