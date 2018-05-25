var gulp = require('gulp'),
    livereload = require('gulp-livereload');


var postcss = require('gulp-postcss');
var cssImport = require('postcss-import');
var mixins = require('postcss-mixins');
var simpleVars = require('postcss-simple-vars');
var nested = require('postcss-nested');
var color = require('postcss-color-function');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var svgSprite = require('gulp-svg-sprites');
var cache = require('gulp-cache');
var del = require('del');

var theme_dir = '';

gulp.task('css', function(){
  var processors = [
    cssImport,
    mixins,
    simpleVars,
    nested,
    color,
    autoprefixer({browsers: ['last 2 versions']}),
  ];
  return gulp.src(theme_dir + 'css/style.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest(theme_dir + 'dist/'))
    .pipe(livereload());

});

// Sprites
gulp.task('sprites', function () {
  return gulp.src(theme_dir + 'lib/svg/*.svg')
    .pipe(svgSprite({
      preview: false,
      cssFile: 'css/_sprites.css',
      padding: 5
    }))
    .pipe(gulp.dest(theme_dir + 'dist/img/'))
});

gulp.task('scripts', function () {
    return gulp.src(theme_dir + 'lib/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest(theme_dir +'dist/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(theme_dir + 'dist/'))
});

gulp.task('images', function() {
  return gulp.src(theme_dir + 'dist/img/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(theme_dir + 'dist/img/'))
});


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(theme_dir + 'lib/svg/**/*.svg', ['sprites']);
    gulp.watch(theme_dir + 'css/**/*.css', ['css']);
    gulp.watch(theme_dir +'lib/**/*.js', ['scripts']);
    gulp.watch([theme_dir +'dist/**/*', theme_dir +'*.php', theme_dir + '*.html']).on(['change'], livereload.changed);

});


gulp.task('default', ['css', 'scripts', 'images', 'watch']);


