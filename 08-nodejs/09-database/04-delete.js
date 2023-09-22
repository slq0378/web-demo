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
  hobbies:Array,
  email:String,
  password:String
});
// 根据规则生成Model
const User = mongoose.model("User", UserSchema);

// 删除文档

User.findOne().then(result=>{
  console.log('找到一个：',result);
})
// 找到一个并删除
// User.findOneAndDelete({_id:"5c09f1e5aeb04b22f8460965"}).then(result=>{
//   console.log('找到一个并删除：',result);
// })
// User.deleteMany({}).then(result=>{
//   console.log('找到多个并删除：',result);// ： { acknowledged: true, deletedCount: 4 }
// })