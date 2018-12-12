var del = require('del');
var gulp = require('gulp');
var changed = require('gulp-changed');
var fileInclude = require('gulp-file-include');
var sass = require('gulp-sass');
// TODO(me): replace gulp-util with something else
// var util = require('gulp-util');
var watch = require('gulp-watch');
var webserver = require('gulp-webserver');

gulp.task('clean', function() { return del([ './dist/index.html' ]); });

// Compiles CSS.
gulp.task('compileCss', gulp.series('clean', function() {
  return gulp.src('./dev/app.scss')
      .pipe(sass({outputStyle : 'compressed'}).on('error', sass.logError))
      .pipe(gulp.dest('./dist'));
      // .on('end', function() {
      //   util.log(util.colors.black.bgGreen('CSS: Compiled.'));
      // });
}));

// Copies all assets.
gulp.task('copyAssets', gulp.series('clean', function() {
  return gulp.src('./data/**/*')
      .pipe(gulp.dest('./dist/assets/'));
      // .on('end', function() {
      //   util.log(util.colors.black.bgGreen('Assets: Copied'));
      // }));
}));

// Copies only new assets.
gulp.task('copyNewAssets', function() {
  return gulp.src('./data/**/*')
      .pipe(changed('./dist/assets/'))
      .pipe(gulp.dest('./dist/assets/'));
      // .on('end', function() {
      //   util.log(util.colors.black.bgGreen('New Assets: Copied'));
      // }));
});

// Copies Html.
gulp.task('copyHtml', gulp.series('compileCss', function() {
  return gulp.src('./dev/index.html')
      .pipe(fileInclude({prefix : '@@', basepath : './dist'}))
      .pipe(gulp.dest('./dist'));
      // .on('end', function() {
      //   util.log(util.colors.black.bgGreen('HTML: Compiled'));
      // }));
}));

gulp.task('webserver', gulp.series('copyAssets', 'copyHtml', function() {
  return gulp.src('./dist').pipe(webserver({
    livereload : false,
    directoryListing : false,
    open : false,
    path : '/'
  }));
}));

gulp.task('default', gulp.series('webserver', function() {
  gulp.watch('./data/**/*', gulp.series('copyNewAssets'));
  gulp.watch('./dev/**/*.scss', gulp.series('copyHtml'));
  gulp.watch('./dev/index.html', gulp.series('copyHtml'));
}));
