const mongoose = require("mongoose");
const DB_URL = "mongodb://localhost:27017/mongoosesample";
/** * 连接 */
mongoose
  .connect(DB_URL)
  .then((db) => {
    console.log("连接数据库成功");
  })
  .catch((error) => {
    console.log("连接数据库失败：", error);
  });

// 定义集合规则Schema
Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: String, //用户账号
  age: Number, //年龄
});
// 根据规则生成Model
const User = mongoose.model("User", UserSchema);

// 创建文档，向集合中插入文档
User.create({ name: "张三", age: 23 }, (err, doc) => {
  console.log(err);
  console.log(doc);
});
// promise 方式
User.create({ name: "李四", age: 33 }).then((result)=>{
    console.log('result',result);
})