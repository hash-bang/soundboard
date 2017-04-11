var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var rimraf = require('rimraf');

gulp.task('default', ['build']);
gulp.task('build', ['js', 'css']);

gulp.task('gh-pages', ['build'], function() {
	rimraf.sync('./gh-pages');

	return gulp.src([
		'./LICENSE',
		'./_config.yml',
		'./app.js',
		'./index.html',
		'./style.css',
		'./node_modules/angular/angular.min.js',
		'./node_modules/@momsfriendlydevco/angular-bs-tooltip/dist/angular-bs-tooltip.min.js',
		'./node_modules/bootstrap/dist/css/bootstrap.min.css',
		'./node_modules/bootstrap/dist/js/bootstrap.min.js',
		'./node_modules/font-awesome/css/font-awesome.min.css',
		'./node_modules/font-awesome/fonts/fontawesome-webfont.ttf',
		'./node_modules/font-awesome/fonts/fontawesome-webfont.woff',
		'./node_modules/font-awesome/fonts/fontawesome-webfont.woff2',
		'./node_modules/jquery/dist/jquery.min.js',
		'./node_modules/angular-audio/app/angular.audio.js',
	], {base: __dirname})
		.pipe(ghPages({
			cacheDir: 'gh-pages',
			push: true, // Change to false for dryrun (files dumped to cacheDir)
			// force: true, // Required to include node_modules files even though they are in .gitignore
		}))
});