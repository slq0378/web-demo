const mongoose = require("mongoose");
const DB_URL = "mongodb://localhost:27017/mongoosesample";
/** * 连接 */
mongoose
  .connect(DB_URL)
  .then((db) => {
    console.log("连接数据库成功");

  })
  .catch((error) => {
    console.log("连接数据库失败：",error);
  });
// /** * 连接成功 */
// mongoose.connection.on("connected", function () {
//   console.log("Mongoose connection open to " + DB_URL);
// });
// /** * 连接异常 */
// mongoose.connection.on("error", function (err) {
//   console.log("Mongoose connection error: " + err);
// });
// /** * 连接断开 */
// mongoose.connection.on("disconnected", function () {
//   console.log("Mongoose connection disconnected");
// });

// 定义集合规则Schema
Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: { type: String }, //用户账号
  userpwd: { type: String }, //密码
  userage: { type: Number }, //年龄
});
// 根据规则生成Model
const User = mongoose.model("User", UserSchema);

// 使用model操作数据
// 插入数据
const user = new User({
  username: "莉丝",
  userpwd: "1234",
  userage: 12,
});
// 保存数据
user.save();
