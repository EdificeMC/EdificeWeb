var gulp = require('gulp');
var browserSync = require('browser-sync');
var bundler = require('aurelia-bundler');
var del = require('del');

gulp.task('default', function(done) {
    browserSync.init({
        online: false,
        open: false,
        port: 3001,
        server: {
            baseDir: ['.'],
            middleware: function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }
    }, done);
});

// pull the dependencies we need to bundle directly from package.json
const includeDeps = Object.keys(require('./package.json').jspm.dependencies);

const config = {
  "bundles": {
    "src/dist/app-build": {
      includes: [
        "[*.js]",
        "*.html!text",
        "*.css!text"
      ],
      options: {
        inject: true,
        minify: true,
        depCache: true,
        rev: false
      }
    },
    "src/dist/aurelia": {
      includes: includeDeps,
      options: {
        inject: true,
        minify: true,
        depCache: false,
        rev: false
      }
    }
  }
};

gulp.task('bundle', ['unbundle'], function() {
    del.sync(['src/dist/**']); // cleanup the old artifacts
    return bundler.bundle(config);
});

gulp.task('unbundle', function() {
    return bundler.unbundle(config);
});
