var gulp = require('gulp');
var scss = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var server = require('gulp-webserver');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var url = require('url');
var path = require('path');
var fs = require('fs');
var datas = require('./mock/datas.json')
gulp.task('sass', function() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(scss())
        .pipe(cleanCss())
        .pipe(gulp.dest('./src/css'))
});
// gulp.task('default', function() {
//     return gulp.src('./src/css/**/*.css')

//     .pipe(gulp.dest('./src/css'))
// })
gulp.task('auto', function() {
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass', 'default'))
})
gulp.task('dserver', function() {
    return gulp.src('src')
        .pipe(server({
            host: '169.254.195.95',
            port: 8080,
            // open: true,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/api/product') {
                    res.end(JSON.stringify({ code: 1, data: datas }))
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }

            }

        }))
})
gulp.task('dev', function() {
    gulp.series('sass', 'dserver', 'auto')
})
gulp.task('zipCss', function() {
    gulp.src('./src/css/**/*.js')
        .pipe(cleanCss())
        .pipe(rename(function(path) {
            path.basename += '.min'
        }))
        .pipe(gulp.dest('./build/css'))
})
gulp.task('zipjs', function() {
    gulp.src('./src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename(function(path) {
            path.basename += '.min'
        }))

    .pipe(gulp.dest('./build/js'))
})