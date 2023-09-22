const path = require('path')

// path.join
let str = path.join('a','b','c')// a/b/c
console.log('path.join:',str);
// __dirname 绝对路径
console.log(path.join(__dirname,'1.txt'));
console.log(__dirname);