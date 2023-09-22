const http = require("http");
const url = require("url");
const querystring = require("querystring");
require("./model/index");
const User = require("./model/user");
const template = require("art-template");
const path = require("path");
// 导入插件,配置模板
// const dateformat = require("dateformat");
import * as dateformat from 'dateformat'
const app = http.createServer();
const views = path.join(__dirname, "views", "04.art");
// 监听请求
app.on("request", async (req, res) => {
  const method = req.method;
  const { pathname, query } = url.parse(req.url, true);
  console.log("pathmame", pathname, query);
  if (method == "GET") {
    if (pathname == "/list") {
      // list 用户界面
      let user = await User.find();
      console.log("user:", user);
      let list1 = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>用户列表</title>
        <!-- 最新版本的 Bootstrap 核心 CSS 文件 -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">
    </head>
    <body>
	<div class="container">
		<h6>
			<a href="add" class="btn btn-primary">添加用户</a>
		</h6>
		<table class="table table-striped table-bordered">
			<tr>
				<td>用户名</td>
				<td>年龄</td>
				<td>爱好</td>
				<td>邮箱</td>
				<td>操作</td>
			</tr>`;
      let list2 = ``;
      user.forEach((item) => {
        list2 += `
            <tr>
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>
    
                `;
        item.hobbies.forEach((hob) => {
          list2 += `<span> ${hob} </span>`;
        });

        list2 += `
                </td>
                <td>${item.email}</td>
                <td>
                    <a href="/remove?id=${item._id}" class="btn btn-danger btn-xs">删除</a>
                    <a href="/modify?id=${item._id}" class="btn btn-success btn-xs">修改</a>
                </td>
            </tr>`;
      });

      let list3 = `      </table>
            </div>
            </body>
            </html>`;
      res.end(list1 + list2 + list3);
    } else if (pathname == "/add") {
      // add 用户界面
      let add = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>用户列表</title>
            <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
            integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu"
            crossorigin="anonymous"
          />
        </head>
        <body>
            <div class="container">
                <h3>添加用户</h3>
                <form action="/add" method="post" >
                  <div class="form-group">
                    <label>用户名</label>
                    <input type="text" class="form-control" placeholder="请填写用户名" name="name">
                  </div>
                  <div class="form-group">
                    <label>密码</label>
                    <input type="password" class="form-control" placeholder="请输入密码" name="password">
                  </div>
                  <div class="form-group">
                    <label>年龄</label>
                    <input type="text" class="form-control" placeholder="请填写年龄" name="age">
                  </div>
                  <div class="form-group">
                    <label>邮箱</label>
                    <input type="email" class="form-control" placeholder="请填写邮箱" name="email">
                  </div>
                  <div class="form-group">
                    <label>请选择爱好</label>
                    <div>
                        <label class="checkbox-inline">
                          <input type="checkbox" value="足球" name="hobbies"> 足球
                        </label>
                        <label class="checkbox-inline">
                          <input type="checkbox" value="篮球" name="hobbies"> 篮球
                        </label>
                        <label class="checkbox-inline">
                          <input type="checkbox" value="橄榄球" name="hobbies"> 橄榄球
                        </label>
                        <label class="checkbox-inline">
                          <input type="checkbox" value="敲代码" name="hobbies"> 敲代码
                        </label>
                        <label class="checkbox-inline">
                          <input type="checkbox" value="抽烟" name="hobbies"> 抽烟
                        </label>
                        <label class="checkbox-inline">
                          <input type="checkbox" value="喝酒" name="hobbies"> 喝酒
                        </label>
                        <label class="checkbox-inline">
                          <input type="checkbox" value="烫头" name="hobbies"> 烫头
                        </label>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary">添加用户</button>
                </form>
            </div>
        </body>
        </html>`;
      res.end(add);
    } else if (pathname == "/modify") {
      // 修改 用户界面
      //  根据id查询用户
      let user = await User.findOne({ _id: query.id });
      // console.log('modify',user);
      let add1 = `<!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <title>用户列表</title>
     <link
     rel="stylesheet"
     href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
     integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu"
     crossorigin="anonymous"
   />
 </head>
 <body>
     <div class="container">
         <h3>添加用户</h3>
         <form action="/modify?id=${query.id}" method="post" >
           <div class="form-group">
             <label>用户名</label>
             <input value="${user.name}" type="text" class="form-control" placeholder="请填写用户名" name="name">
           </div>
           <div class="form-group">
             <label>密码</label>
             <input value="${user.password}" type="password" class="form-control" placeholder="请输入密码" name="password">
           </div>
           <div class="form-group">
             <label>年龄</label>
             <input value="${user.age}" type="text" class="form-control" placeholder="请填写年龄" name="age">
           </div>
           <div class="form-group">
             <label>邮箱</label>
             <input value="${user.email}" type="email" class="form-control" placeholder="请填写邮箱" name="email">
           </div>
           <div class="form-group">
             <label>请选择爱好</label>
             <div>
           `;
      let add2 = ``;
      let hobbies = [
        "足球",
        "篮球",
        "橄榄球",
        "敲代码",
        "抽烟",
        "喝酒",
        "烫头",
        "打豆豆",
        "睡觉",
        "吃饭",
      ];
      hobbies.forEach((hob) => {
        let isHob = user.hobbies.includes(hob);
        if (isHob) {
          add2 += ` <label class="checkbox-inline">
            <input type="checkbox" value="${hob}" name="hobbies" checked> ${hob}
          </label>
          `;
        } else {
          add2 += ` <label class="checkbox-inline">
            <input type="checkbox" value="${hob}" name="hobbies"> ${hob}
          </label>
          `;
        }
      });
      let add3 = `
            </div>
            </div>
            <button type="submit" class="btn btn-primary">修改用户</button>
            </form>
        </div>
        </body>
        </html>
      `;
      res.end(add1 + add2 + add3);
    } else if (pathname == "/remove") {
      await User.findOneAndDelete({ _id: query.id });
      // 301 重定向list
      res.writeHead(301, {
        location: "/list",
      });
      res.end();
    } else {
      // const html = template(views, {
      //   name: "哦搜索",
      //   age: 10,
      //   content:'<h1>标题111</h1>'
      // });
      // const html = template(views, {
      //  users:[
      //    {
      //     name: "1哦搜索",
      //     age: 60,
      //    },{
      //     name: "2哦搜索",
      //     age: 20,
      //    }
      //  ]
      // });
      // 导入方法到模板中
      template.defaults.imports.dateformat = dateformat;
      const html = template(views, {
        time: Date,
      });
      res.writeHead(200, {
        "content-type": "text/html;charset=utf-8",
      });
      res.end(html);
    }
  } else if (method == "POST") {
    if (pathname == "/add") {
      // add 新增用户接口
      let formdata = "";
      req.on("data", (params) => {
        formdata += params;
      });
      req.on("end", async (result) => {
        // console.log(querystring.parse(formdata));
        // 将用户信息添加到数据库
        let user = querystring.parse(formdata);
        await User.create(user);
        // 301 重定向list
        res.writeHead(301, {
          location: "/list",
        });
        res.end();
      });
    } else if (pathname == "/modify") {
      let formdata = "";
      req.on("data", (params) => {
        formdata += params;
      });
      req.on("end", async (result) => {
        // console.log(querystring.parse(formdata));
        // 将用户信息添加到数据库
        let user = querystring.parse(formdata);
        await User.updateOne(user);
        // 301 重定向list
        res.writeHead(301, {
          location: "/list",
        });
        res.end();
      });
    }
  }
});

// 监听端口
app.listen(3000);
console.log("服务器启动成功");
