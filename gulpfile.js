var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var rimraf = require('rimraf');

gulp.task('default', ['serve']);

gulp.task('serve', function() {
	var monitor = nodemon({
		script: './server.js',
		ext: 'js css',
	})
		.on('start', function() {
			console.log('Server started');
		})
		.on('restart', function() {
			console.log('Server restarted');
		});
});

gulp.task('gh-pages', function() {
	rimraf.sync('./gh-pages');

	return gulp.src([
		'./LICENSE',
		'./_config.yml',
		'./app.js',
		'./index.html',
		'./style.css',
		'./node_modules/lodash/lodash.min.js',
		'./node_modules/angular/angular.min.js',
		'./node_modules/@momsfriendlydevco/angular-bs-tooltip/dist/angular-bs-tooltip.min.js',
		'./node_modules/bootstrap/dist/css/bootstrap.min.css',
		'./node_modules/bootstrap/dist/js/bootstrap.min.js',
		'./node_modules/font-awesome/css/font-awesome.min.css',
		'./node_modules/font-awesome/fonts/fontawesome-webfont.ttf',
		'./node_modules/font-awesome/fonts/fontawesome-webfont.woff',
		'./node_modules/font-awesome/fonts/fontawesome-webfont.woff2',
		'./node_modules/jquery/dist/jquery.min.js',
		'./sounds/**/*',
	], {base: __dirname})
		.pipe(ghPages({
			cacheDir: 'gh-pages',
			push: true, // Change to false for dryrun (files dumped to cacheDir)
			// force: true, // Required to include node_modules files even though they are in .gitignore
		}))
});
