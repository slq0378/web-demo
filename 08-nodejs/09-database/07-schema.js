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
  name: {
    type: String,
  },
});

const PostSchema = new Schema({
  title: {
    type: String,
  },
  author: { // 使用id将文章集合和用户集合关联起来,ID的固定写法 mongoose.Schema.Types.ObjectId
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// 根据规则生成Model
const Post = mongoose.model("Post", PostSchema);
const User = mongoose.model("User", UserSchema);
// 创建user
// User.create({name:'章三'}).then(result=>{
//   console.log(result);
// })
// 创建文章
// Post.create({title:'文章标题2',author:'628b45c9f11c913d94526551'}).then(result=>{
//   console.log(result);
// })
// 查询
Post.find().populate('author').then(result=>{
  console.log(result);
})

// [
//   {
//     _id: new ObjectId("628b4604353bec8d18153240"),
//     title: '文章标题1',
//     author: {
//       _id: new ObjectId("628b45c9f11c913d94526551"),
//       name: '章三',
//       __v: 0
//     },
//     __v: 0
//   },
//   {
//     _id: new ObjectId("628b461981cff8816ae10323"),
//     title: '文章标题2',
//     author: {
//       _id: new ObjectId("628b45c9f11c913d94526551"),
//       name: '章三',
//       __v: 0
//     },
//     __v: 0
//   }
// ]