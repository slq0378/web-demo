// 引入网路服务器模块
const http = require("http");
// 用于处理请求参数
const url = require("url");
// 处理请求字符串
const queryString  = require('querystring')
// 创建服务区
const app = http.createServer();

// 接收请求
app.on("request", (req, res) => {
  // - post通过事件方式接受
  // - data当前请求参数传递的时候发出的data事件
  // - end 当参数传递完毕是发送end事件
  let postParams = '';
  req.on("data", (params) => {
    postParams += params;
  });
  req.on("end", () => {
    console.log(queryString.parse(postParams));
  });
  res.end("ok");
});

// 监听端口
app.listen(3000);

console.log("服务器启动成功");
