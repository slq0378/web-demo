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

// 查询文档，返回数组
// 参数空，查询全部
// User.find().then(result=>{
//   console.log(result);
// })
// User.find({
//   age:33
// }).then(result=>{
//   console.log(result);
// })
// // 返回符合条件的第一条
// User.findOne().then(result=>{
//   console.log(result);
// })
// 条件查询 $gt < data < $lt
User.find({age:{$gt:30,$lt:51}}).then((result)=>{
  console.log('大于30，小于51:',result);
})
// 包含 $in
User.find({age:{$in:[10,20,25]}}).then((result)=>{
  console.log('范围 10,20,25:',result);
})
// 选择查询字段 select,-_id 表示不要某个字段
User.find().select('name password -_id').then(result=>{
  console.log('选择查询字段 select',result);
})
// 排序 ，指定排序方式asc desc
User.find().sort('asc -age').then(result=>{
  console.log('排序age asc：',result);
})
User.find().sort('desc -age').then(result=>{
  console.log('排序age desc：',result);
})
// skip 跳过，limit 限制
User.find().skip(2).limit(3).then(result=>{
  console.log('skip 跳过，limit 限制：',result);
})
