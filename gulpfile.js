var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('default', function(done) {
    browserSync.init({
        online: false,
        open: false,
        port: 3001,
        server: {
            baseDir: ['.'],
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }
    }, done);
});
