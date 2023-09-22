const express = require("express");
const app = express();

// 路由
const home = express.Router();
const user = express.Router();

app.use("/home", home);
app.use("/user", user);

// /home/index
home.get("/list", (req, res) => {
  res.send(req.url);
});

// /user/info
user.get("/info", (req, res) => {
    res.send(req.url);
  });
  

app.listen(3000);
