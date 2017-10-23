var gulp = require('gulp');
var fs = require("fs");
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minimist = require('minimist');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');

var DEST = 'dist/';
var renameFileName ='';

fs.readFile('./html/*.html', function(err, data) {
	if(err) {
		return console.error(err);
	}
	var fileName = data.toString();
	// var reg = \<title[^\>]*\>\s*(?<Title>.*?)\s*\</title\>\;
//	var reg = /\<title\>.*\<\/title\>/;
//	var title = reg.exec(fileName)[0].replace(/\<title\>/, '');
//	var title1 = title.replace(/\<\/title\>/, '');
	var regTitle = /<title>([\s\S]*?)<\/title>/;
	renameFileName = fileName.match(regTitle)[1];
	console.log(fileName.match(regTitle)[1]);
	// console.log(fileName.match(/<title>([\s\S]*?)<\/title>/)[1]);
	// console.log("异步读取: " + data.toString());
});

//gulp.task('default', ["browser-sync"]);

gulp.task('replace', ['clear'], function() {
	gulp.src("./js/**/*.js")
		.pipe(replace('http://192.168.88.108/proxy', 'www.baidu.com')) //替换地址
		.pipe(gulp.dest('./dist/js'));
});

gulp.task("clear", function() {
	return gulp.src('./dist')
		.pipe(clean());
});
gulp.task('merge', function() {
	gulp.src(['./html/**/*.*'])
		.pipe(uglify())
		.pipe(gulp.dest('./dist/'));
});

//
//var knownOptions = {
//	string: 'env',
//	default: {
//		env: process.env.NODE_ENV || 'production'
//	}
//};
//
//var options = minimist(process.argv.slice(2), knownOptions);
//
//gulp.task('scripts', function() {
//	return gulp.src('./js/**/*.js')
//		.pipe(gulpif(options.env === 'production', uglify())) // 仅在生产环境时候进行压缩
//		.pipe(gulp.dest('dist'));
//});
//gulp.task('test', ['clear'], function() {
//	gulp.start('merge');
//});
//gulp.task('libtest', ['clear'], function() {
//	gulp.start('merge');
//});
//gulp.task('pre', ['clear'], function() {
//	gulp.start('merge');
//});
gulp.task('prd', ['clear'], function() {
	gulp.start('merge');
});




gulp.task('htmlmin',['clear'], function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('./html/*.html')
        .pipe(htmlmin(options))
        .pipe(rename(function(path){
        path.basename=renameFileName;
        	console.log(path)
        }))
        .pipe(gulp.dest(DEST));
});