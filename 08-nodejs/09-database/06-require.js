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
// required 必填检验
const PostSchema = new Schema({
  title: {
    type: String,
    // required: true,
    required: [true, "请传入文章标题"], // 是否必填
    minlength: [2, "最小两个字"], //最小长度
    maxlength: 5, // 最大长度，字符串
    trim: true, // 去除首位空格
  },
  age: {
    type: Number,
    max: 100, // 数值型，最大最小
    min: [18, "年龄至少18"],
  },
  publishDate: {
    type: Date,
    default: Date.now, // 默认值
  },
  category: {
    type: String,
    enum: {
      values:["html", "css", "javascript"], // 限定范围，如果不在这个范围，插入失败
      message:'不在限定的范围'
    }
  },
  author: {
    type: String,
    validate: { // 自定义验证器
      validator: (v) => {
        // 返回bool， true 验证成功，false 验证失败
        // v 是要验证的值
        return v && v.length > 4;
      },
      message:'传递的值不符合规则'
    },
  },
});
// 根据规则生成Model
const Post = mongoose.model("Post", PostSchema);
// 如果没有title
// UnhandledPromiseRejectionWarning: ValidationError: Post validation failed: title: Path `title` is required
// Post.create({}).then(result=>{
//   console.log(result);
// })
// Post validation failed: age: 年龄至少18
// Post validation failed: category: `dddd` is not a valid enum value for path `category`.

// Post validation failed: author: 传递的值不符合规则
Post.create({ title: "888", age: 19, category: "html" ,author:'11111'}).then((result) => {
  console.log(result);
});
