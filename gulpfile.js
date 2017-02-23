var gulp = require('gulp');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');
var jshint = require('gulp-jshint');
var replace = require('gulp-replace');
var metadata = require('./package.json');
var connect = require('gulp-connect');

var shortHeader = "/*! Planetary.js <%= version %> | (c) 2013 Michelle Tilley | Released under MIT License */\n"
var fullHeader = [
  "/*! Planetary.js v<%= version %>",
  " *  Copyright (c) 2013 Michelle Tilley",
  " *",
  " *  Released under the MIT license",
  " *  Date: <%= new Date().toISOString() %>",
  " */",
  ""
].join("\n");

var fullSource = gulp.src(['./src/_umd_header.js', './src/body.js', './src/plugins.js', './src/_umd_footer.js']);
var nonPluginSource = gulp.src(['./src/_umd_header.js', './src/body.js', './src/_umd_footer.js']);

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 8866,
    livereload: true
  });
});

gulp.task('refreshpage', function () {
  gulp.src('./dist/*.html')
    .pipe(connect.reload());
});

function build(source, name, headerText, minify) {
  var js = source.pipe(concat(name));
  if (minify) { js = js.pipe(uglify()); }
  js = js.pipe(header(headerText, { version: metadata.version }));
  js.pipe(replace("\r\n", "\n")).pipe(gulp.dest('./dist'));
}

gulp.task('jshint', function() {
  gulp.src(['./src/body.js', './src/plugins.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch:source', function () {
    gulp.watch('./src/**', ['jshint', 'build', 'refreshpage']);
});

gulp.task('build', function() {
  build(fullSource, 'planetaryjs.js', fullHeader, false);
  build(fullSource, 'planetaryjs.min.js', shortHeader, true);
  build(nonPluginSource, 'planetaryjs-noplugins.js', fullHeader, false);
  build(nonPluginSource, 'planetaryjs-noplugins.min.js', shortHeader, true);

  gulp.src('./src/world-110m.json').pipe(gulp.dest('./dist'));
  gulp.src('./src/test.html').pipe(gulp.dest('./dist'));
  gulp.src('./src/world-110m-withlakes.json').pipe(gulp.dest('./dist'));
});

gulp.task('default', ['jshint', 'build', 'connect', 'watch:source']);
