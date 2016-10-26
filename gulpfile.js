
'use strict';

// primary plugins
var gulp = require('gulp'), // gulp
    jade = require('gulp-jade'), // gulp jade
    postcss = require('gulp-postcss'); // gulp postcss

// plugins for postcss
var autoprefixer = require('autoprefixer'),
    precss = require('precss'), // синтаксис scss
    use = require('postcss-use'),
    normalize = require('postcss-normalize'),
    cssnano = require('cssnano'),
    fontmagican = require('postcss-font-magician'), // работа со шрифтами
    sprites = require('postcss-sprites').default,
    pxtorem = require('postcss-pxtorem'),
    center = require('postcss-center'), // центровка через absolute
    focus = require('postcss-focus'); // добвка к :hover - focus

// error
var notify = require('gulp-notify'),
    plumber = require('gulp-plumber');

// image
var imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

// browser sync
var browserSync = require('browser-sync').create();

// other
var del = require('del'),
    sourcemaps = require('gulp-sourcemaps');


//project directory
var distDir = 'dist/';
var srcDir = 'src/';


/////////
// Tasks
//

// Jade
gulp.task('jade', function() {
  return gulp.src(srcDir + 'jade/index.jade')
    // перечень файлов нужно указывать через массив 
    // пр: (['!src/jade/index.jade', 'src/jade/index2.jade'])
    // src/jade/**/*.jade 
    // src/jade/**/*.+(sass | scss)
  .pipe(plumber({
    errorHandler: notify.onError(function (err) {
      return {
        title: 'Jade Error',
        message: err.message
      };
    })
  }))
  .pipe(jade({
    pretty: true // отменяет минификацию html файлов
  }))
  .pipe(gulp.dest(distDir))
  .pipe(notify({ message: 'Update jade complete' }))
  .pipe(browserSync.reload({
            stream: true
        }))
});


// CSS
gulp.task('css', function() {

  var processors = [
        use( { modules: ['postcss-normalize', 'cssnano'] }),
        precss(),
        autoprefixer(),
        pxtorem(),
        focus(),
        center()
    ];

    return gulp.src(srcDir + 'css/main.css')
        .pipe(plumber({
          errorHandler: notify.onError(function (err) {
            return {
              title: 'CSS Error',
              message: err.message
            };
          })
        }))
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distDir + 'css/'))
        .pipe(notify({ message: 'Update css complete' }))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// Images
gulp.task('image', function () {
    gulp.src('src/img/*') 
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(notify({ message: 'Update img complete' }))
        .pipe(gulp.dest('dist/img'));
});


// Clean
gulp.task('clean', function() {
    del(['dist']);
});


// Watch
gulp.task('watch', ['clean', 'jade', 'css', 'image', 'serv'], function() {
    // параметры в квадратных скобках означают, что эти таски нужно 
    // выполнить до того, как запустится таск watch
    gulp.watch('src/css/**/*.css', ['css']);
    gulp.watch('src/jade/**/*.jade', ['jade']);
    gulp.watch('src/img/**/*.{jpg,png,svg}', ['image']);

});


// Serv
gulp.task('serv', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        }
    });
});


// Default task
gulp.task('default', ['watch']);