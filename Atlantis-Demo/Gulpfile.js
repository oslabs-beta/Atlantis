const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const sassify = require('sassify');
const nodemon = require('gulp-nodemon');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const path = require('path');

const sourceFile = path.join(__dirname, '/client/index.js');
const destFile = 'browserify-bundle.js';
const destFolder = path.join(__dirname, 'build');

gulp.task('prod', function () {
  
});
