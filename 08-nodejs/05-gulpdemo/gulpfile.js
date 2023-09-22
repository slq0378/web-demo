const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const fileinclude = require("gulp-file-include");
const less = require("gulp-less");
const csso = require("gulp-csso");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
// 建立任务
// 任务名称，回调参数
gulp.task("first", () => {
  console.log("first");
  // 获取文件
  gulp.src("./src/css/base.css")
  .pipe(gulp.dest("dist/css"));
});

// html 任务
// 1 代码压缩
// 2 抽取公共
gulp.task("htmlmin", () => {
  gulp
    .src("./src/*.html")
    .pipe(fileinclude())
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(gulp.dest("dist"));
});

// css
// 1 less 转换
// 2 css压缩
gulp.task("cssmin", () => {
  gulp
    .src(["./src/css/*.less", "./src/css/*.css"])
    .pipe(less())
    .pipe(csso())
    .pipe(gulp.dest("dist/css"));
});

// js
// 1 es6转换
// 2 代码压缩
gulp.task("jsmin", () => {
  gulp
    .src("./src/js/*.js")
    .pipe(
      babel({
        // 判断运行环境，转换成当前运行环境支持的代码
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
});

// 复制文件夹
gulp.task('copy',()=>{
  // gulp.src('./src/images/*')
  // .pipe(gulp.dest('dist/images'));

  gulp.src('./src/lib/**/*')
  .pipe(gulp.dest('dist/lib'));
})

// 构建任务 build
//  注意版本问题 ,批量运行方式支持3.x，4.x不支持,使用parallel
gulp.task('default',gulp.parallel(['htmlmin','cssmin','jsmin','copy']))
// gulp.task('build',['htmlmin','cssmin','jsmin','copy'])