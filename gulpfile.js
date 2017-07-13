"use strict";

var gulp         = require('gulp'), // ���������� Gulp
    autoprefixer = require("autoprefixer"),// ���������� ���������� ��� ��������������� ���������� ���������
    cache        = require('gulp-cache'), // ���������� ���������� �����������
    concat       = require('gulp-concat'), // ���������� gulp-concat (��� ������������ ������)
    del          = require('del'), // ���������� ���������� ��� �������� ������ � �����
    imagemin     = require('gulp-imagemin'), // ������ ��������
    minifycss    = require('gulp-csso'), // ���������� ����� ��� ����������� CSS
    mqpacker     = require('css-mqpacker'), // ������������ media-���������
    plumber      = require('gulp-plumber'), // �� ��������� �������� ������ gulp ��� ������
    postcss      = require("gulp-postcss"),// ����� ��� autoprefixer � mqpacker
    rename       = require('gulp-rename'), // ���������� ���������� ��� �������������� ������
    run          = require('run-sequence'), // ��� ������� ������� ���������� ������
    sass         = require('gulp-sass'), //���������� Sass �����,
    server       = require('browser-sync').create(),//browser autorefresh
    svgstore     = require('gulp-svgstore'), // �������� svg �������
    svgmin       = require('gulp-svgmin'), // ����������� svg �������
    uglify       = require('gulp-uglifyjs'); // ���������� gulp-uglifyjs (��� ������ JS)

gulp.task('sass', function() { // ������� ���� Sass
    return gulp.src('app/sass/style.scss') // ����� ��������
        .pipe(plumber())
        .pipe(sass()) // ����������� Sass � CSS ����������� gulp-sass
        .pipe(postcss([
          autoprefixer({browsers: [
            "last 2 versions"
          ]}),
          mqpacker({
            sort: true
          })
        ]))
        .pipe(minifycss()) // �������
        .pipe(rename({suffix: '.min'})) // ��������� ������� .min
        .pipe(gulp.dest('app/css')) // ��������� ��������� � ����� app/css
        .pipe(server.stream());
});

gulp.task('html-update', function() {
  return gulp.src('app/*.html') // ����� ��������
    .pipe(server.stream());
});

gulp.task('script-update', function() {
  return gulp.src('app/js/script.js') // ����� ��������
    .pipe(server.stream());
});

gulp.task('server', ['sass'], function() {
  server.init({
    server: '.',
    notify: false,
    open: true,
    cors: true,
    ui: false
  })
});

gulp.task('script-min', function() {
    return gulp.src('app/js/script.js') //script.js in app/js
        .pipe(rename({suffix: '.min'})) // ��������� ������� .min
        .pipe(uglify()) // ������� JS ����
        .pipe(gulp.dest('app/js')); // ��������� � ����� app/js
});

gulp.task('images', function() {
  return gulp.src('img/**/*.{png,jpg,gif}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),//1-max.; 3-safe; 10-no compress.
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest('img'));
});

gulp.task('symbols', function() {
  return gulp.src('app/img/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest('app/img'));
});

gulp.task('watch', ['sass'], function() {
    gulp.watch('app/sass/**/*.+(scss|sass)', ['sass']); // ���������� �� sass �������
    gulp.watch('app/*.html', ['html-update']);
    gulp.watch('app/js/script.js', ['script-update']);
    // ���������� �� ������� ������ ������
    server.init({
      server: "app/"
    });
});

gulp.task('clean', function() {
    return del.sync('build'); // ������� ����� ������ ������� build ����� ��������� �������
});

gulp.task('build', ['clean', 'sass', 'script-min', 'images', 'symbols'], function() {
    var buildCss = gulp.src('app/css/style.min.css')
    .pipe(gulp.dest('build/css'))

    var buildCss = gulp.src('app/libs/*.css') //������� ������������ js ���������
    .pipe(gulp.dest('build/libs'))

    var buildFonts = gulp.src('app/fonts/**/*.{woff,woff2}*') // ��������� ������ � ���������
    .pipe(gulp.dest('build/fonts'))

    var buildImg = gulp.src('app/img/**/*') // ��������� �������� � ���������
    .pipe(gulp.dest("build/img/"));

    var buildLibs = gulp.src('app/libs/*.js') // ��������� ���������� � ���������
    .pipe(gulp.dest('build/libs'))

    var buildJs = gulp.src('app/js/script.min.js') // ��������� �������� ������ ������� � ���������
    .pipe(gulp.dest('build/js'))

    var buildHtml = gulp.src('app/*.html') // ��������� HTML � ���������
    .pipe(gulp.dest('build'));
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);