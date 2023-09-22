const mongoose = require("mongoose");

// 创建model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    hobbies: Array,
    password: String,
  })
);
module.exports = User