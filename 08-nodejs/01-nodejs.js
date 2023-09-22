let add = function(a,b){
    return a+b;
}
let hello = () => 'hello node'
// 模块成员导出
exports.add = add;
module.exports.hello = hello;