const gulp = require('gulp')
const sass = require('gulp-sass')
const browsersync = require("browser-sync").create();
const babel = require('gulp-babel')

const bs = function (done) {
    browsersync.init({
        server: {
            baseDir: "./demo"
        },
        open: false,
        port: 3000
    });
    done();
}

const styles = function () {
    return gulp
        .src("./src/*.scss")
        .pipe(sass({
            outputStyle: "expanded"
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browsersync.stream())
}

const scripts = function () {
    return gulp.src('./src/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dist'))
}

const demoBuild = function (done) {
    gulp
        .src("./src/*.scss")
        .pipe(sass({
            outputStyle: "expanded"
        }))
        .pipe(gulp.dest('demo'))
        .pipe(browsersync.stream())

    gulp.src('./src/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('demo'))
    done()
}

const watchFiles = function () {
    gulp.watch("./src/*.scss", gulp.parallel(styles, demoBuild));
    gulp.watch("./src/*.js", gulp.parallel(scripts, demoBuild));
}

const watch = gulp.parallel(watchFiles, bs)

exports.default = watch