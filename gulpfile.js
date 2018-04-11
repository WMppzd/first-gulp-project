// 处理路径的
const path=require('path');
// 处理系统文件
const fs=require('fs');
// 引入gulp
const gulp=require('gulp');
// less转换css
const less=require('gulp-less');
// css加前缀
const autoprefixer=require('gulp-autoprefixer');
// 压缩css
const cssmin=require('gulp-cssmin');
// 压缩js
const uglify=require('gulp-uglify');
// 压缩html
const htmlmin=require('gulp-htmlmin');
// 处理es6语法
// const babel=require('gulp-babel');
// 浏览器同步
const browserSync=require('browser-sync').create();
const reload = browserSync.reload;
// 拆分页面
const fileinclude=require('gulp-file-include');
// 清理文件夹
const clean=require('gulp-clean');
// 是任务能按顺序执行
const runSequence=require('run-sequence');
// 处理事件指纹
const rev=require('gulp-rev');
const revCollector=require('gulp-rev-collector');
// 文件重命名
const rename=require('gulp-rename');

gulp.task('clean',function(){
  return gulp.src(path.join(__dirname,'./dist/*'),{read: false})
  .pipe(clean());
})
gulp.task('css',function(){
  return gulp.src(path.join(__dirname,'src','css/*'))
  .pipe(less())
  .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            // cascade: false
        }))
  .pipe(cssmin())
  .pipe(rev())
  .pipe(gulp.dest(path.join(__dirname,'dist','css')))
  .pipe(rev.manifest())
  .pipe(rename('css-manifest.json'))
  .pipe(gulp.dest('./dist/rev'));
});
gulp.task('js',function(){
  return gulp.src(path.join(__dirname,'src/js/*.js'))
  .pipe(uglify())
  .pipe(rev())
  .pipe(gulp.dest(path.join(__dirname,'dist/js')))
  .pipe(rev.manifest())
  .pipe(gulp.dest('./dist/rev'));
});
gulp.task('html',function(){
  return gulp.src(path.join(__dirname,'src/view/*.html'))
  .pipe(fileinclude({
    prefix:'@@',
    basepath:'@file'
  }))
  .pipe(htmlmin(
    {             // 把html交给htmlmin插件处理
      collapseWhitespace: true, // 设置参数去除空白
      minifyJS: true,           // 压缩html中的js
      minifyCSS: true,          // 压缩html中的css
      removeComments: true      // 去除html注释
    }))
  .pipe(gulp.dest(path.join(__dirname,'dist')))
});
gulp.task('bulid',function(){
  return runSequence('clean',['css','js','html'],function(){
       return gulp.src(['./dist/rev/*.json', './dist/index.html'])
      .pipe(revCollector())
      .pipe(gulp.dest('./dist'));
  })
});
gulp.task('sync',['bulid'],function(){
  return browserSync.init({
    server: {
      baseDir: "./dist" // 监控目录的基准路径
    },
    port:8888, // 配置服务端口
    notify: false // 设置页面是否有提示信息
  });
  // 具体监听什么
  gulp.watch(path.join(__dirname,'src',"view/*"), ['html']).on('change', reload);
  gulp.watch(path.join(__dirname,'src',"css/**/*"), ['css']).on('change', reload);
  gulp.watch(path.join(__dirname,'src',"js/**/*"), ['js']).on('change', reload);
});
gulp.task('default',['sync']);
