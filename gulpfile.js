'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    jshint = require('gulp-jshint'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    slim = require('gulp-slim'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    bootstrapDir = './bower_components/bootstrap-sass';

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        // html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        slim: 'src/slim/*.slim', //Синтаксис src/*.silm говорит gulp что мы хотим взять все файлы с расширением .slim
        js: 'src/js/partials/app.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/*.scss',
        fonts: 'bower_components/bootstrap-sass/assets/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        slim: 'src/**/*.slim',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    open: false,
    logPrefix: "IL"
};

// JSHint task
gulp.task('lint', function() {
  gulp.src('./app/scripts/*.js')
  .pipe(jshint())
  // You can look into pretty reporters as well, but that's another story
  .pipe(jshint.reporter('default'));
});

// Browserify task
gulp.task('browserify', function() {
  // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
  return browserify({
        entries: path.src.js,
        debug: true
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(path.build.js));

  /*gulp.src([path.src.js])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  // Bundle to a single file
  .pipe(concat('main.js'))
  // Output it to our dist folder
  .pipe(gulp.dest(path.build.js));*/
});

gulp.task('fonts:build', function() {
    // gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
	gulp.src(bootstrapDir + '/assets/fonts/**/*')
    	.pipe(gulp.dest(path.build.fonts));
});

gulp.task('slim:build', function(){
  gulp.src(path.src.slim)
    .pipe(slim({
      pretty: true
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});
gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass({
			includePaths: [bootstrapDir + '/assets/stylesheets'],
    	})) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});
gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('webserver', function () {
    browserSync(config);
});
gulp.task('watch', function(){
    watch([path.watch.slim], function(event, cb) {
        gulp.start('slim:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
   	watch([path.watch.js], function(event, cb) {
        gulp.start('browserify');
    });
    /*watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });*/
});


gulp.task('build', [
    'slim:build',
    'browserify', //js
    'style:build',
    'fonts:build',
]);

gulp.task('default', ['build', 'webserver', 'watch']);

