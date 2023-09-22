const mongoose = require("mongoose");

// 连接数据库
mongoose
  .connect("mongodb://localhost/test")
  .then((result) => {})
  .catch((error) => {});