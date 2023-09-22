
const fs = require("fs");

// 读取
// fs.readFile('文件路径',[文件编码],callback)
fs.readFile("../js/index.js", "utf-8", (err, doc) => {
  // 如果读取发生错误，err不为空
  // doc是文件内容
  console.log('err:',err);
  if (err == null) {
    console.log(doc);
  }
});

// 写入
// fs.writeFile('文件路径','数据',callback)
fs.writeFile('./1.txt','hahaha',err=>{
    console.log('err',err)
    if(err == null){
        console.log('write success');
    }
})
