const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  mode: "development", // development production
  entry: path.join(__dirname, "./src/index.js"), // 设置入口文件
  output: {
    // 设置输出文件
    path: path.join(__dirname, "./dist"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.jpg|png|gif|bmp|ttf|eot|svg|woff|woff2$/,
        //limit用来设置字节数，只有小于limit值的图片，才会转换
        //为base64图片
        // use:"url-loader?limit=10240"
        // use: "url-loader",
      },
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
    ],
  },
};
