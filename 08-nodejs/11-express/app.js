// express 框架使用
const express = require("express");
const app = express();
// 拦截所有请求
app.use((req, res, next) => {
    console.log(req.url);
    next();
  });
app.get("/", (req, res, next) => {
  req.name = "lisi";
  next(); // 交给下一个中间件
});

app.get("/", (req, res) => {
  res.send({ name: "zhangsan" });

});
app.get("/list", (req, res) => {
    res.send("list");
});
app.get("/detail", (req, res) => {
    res.send("detail");
});

app.listen(3000);
