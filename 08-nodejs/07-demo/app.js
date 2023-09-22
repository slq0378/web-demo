const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const mime = require("mime");
const app = http.createServer();

app.on("request", (req, res) => {
  // console.log(req.method);
  // const method = req.method.toLocaleLowerCase();

  let { pathname } = url.parse(req.url);
  pathname = pathname == "/" ? "/default.html" : pathname;
  // 将用户的请求路径转换成实际的服务器路径
  let realPath = path.join(__dirname, "public" + pathname);
  console.log(mime.getType(realPath));
  let type = mime.getType(realPath);
  // console.log("type", type);
  fs.readFile(realPath, (err, doc) => {
    // console.log("doc", doc);
    if (err == null) {
      res.end(doc);
    } else {
      res.writeHead(404, {
        "content-type": "text/plain;charset=utf-8"
      });
      res.end("资源不存在");
    }
  });
  res.writeHead(200, {
    "content-type": type+";charset=utf-8"
  });
});
app.listen(3000);
