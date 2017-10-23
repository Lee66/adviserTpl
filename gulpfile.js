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
var renameFileName = '';

fs.readFile('./html/tpl1.html', function(err, data) {
	if(err) {
		console.log(err);
	}
	var fileName = data.toString();
	var regTitle = /<title>([\s\S]*?)<\/title>/;
	renameFileName = fileName.match(regTitle)[1];
	console.log(fileName.match(regTitle)[1]);
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
gulp.task("clearbackup", function() {
	return gulp.src('./backup')
		.pipe(clean());
});
gulp.task('backup', function() {
	var time = new Date();
	gulp.src(['./html/**/*.*'])
		.pipe(gulp.dest('./backup/' + time));
});

gulp.task('prd', ['clear'], function() {
	gulp.start('merge');
});

gulp.task('htmlmin', ['clear'], function(cb) {
	var options = {
		removeComments: true, //清除HTML注释
		collapseWhitespace: true, //压缩HTML
		collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
		removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
		minifyJS: true, //压缩页面JS
		minifyCSS: true //压缩页面CSS
	};
	console.log(cb());
	//	renameFileName = fileName.match(/<title>([\s\S]*?)<\/title>/)[1];

	gulp.src('./html/*.html')
		.pipe(htmlmin(options))
		//      .pipe(match(/<title>([\s\S]*?)<\/title>/)[1])
		.pipe(rename(function(path) {
			path.basename = renameFileName;
			console.log(path)
		}))
		.pipe(gulp.dest(DEST));
});

var through = require('through2');

gulp.task('testHtmlmin', function() {
	var options = {};
	gulp.src('./html/*.html')
		.pipe(htmlmin(options))
		.pipe(gulp.dest('build/'));
});



var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin');
 
gulp.task('build', function () {
    var options = {
        removeComments: true,  //清除HTML注释
        collapseWhitespace: true,  //压缩HTML
        collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
        minifyJS: true,  //压缩页面JS
        minifyCSS: true  //压缩页面CSS
    };
    gulp.src('./build/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('build/html3'));
});