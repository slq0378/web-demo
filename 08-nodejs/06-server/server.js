// 引入网路服务器模块
const http = require("http");
// 用于处理请求参数
const url = require("url");

// 创建服务区
const app = http.createServer();

// 接收请求
app.on("request", (req, res) => {
  //   console.log(req.method);
  console.log(req.url); // http://localhost:3000/?name=zhangsan&age=20
  //   console.log(req.headers);
  res.writeHead(200, {
    // "content-type": "text/plain", // 纯文本
      'content-type':'text/html;charset=utf-8' // 解析html,指定utf-8编码，不然中文乱码
  });
  // 两个参数，1 url地址，2 是否解析成对象
  let { query, pathname } = url.parse(req.url, true);
  console.log(pathname);
  console.log(query.age);
  console.log(query.name);
  if (pathname == "/index" || pathname == "/") {
    res.end("<h2>欢迎来到首页</h2>");
  } else if (pathname == "/list") {
    res.end("欢迎来到列表页");
  } else {
    res.end("not found");
  }
  //   if (req.method == "POST") {
  //     res.end("post1111");
  //   } else if (req.method == "GET") {
  //     res.end("get2222");
  //   } else {
  //     res.end("<h2>hahahahaha</h3>");
  //   }
});

// 监听端口
app.listen(3000);

console.log("服务器启动成功");
