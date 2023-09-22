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
// 找到一个并修改
User.updateOne({name:"李四"},{age:99}).then(result=>{
  console.log('找到一个并修改：',result);
  // {
  //   acknowledged: true,
  //   modifiedCount: 1,
  //   upsertedId: null,
  //   upsertedCount: 0,
  //   matchedCount: 1
  // }
})
// 找到多个并修改
User.updateMany({name:{$in:["李四",'赵六']}},{age:2}).then(result=>{
  console.log('找到一个并修改：',result);
})