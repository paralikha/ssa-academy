var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps');

var preprocess = require('gulp-preprocess');

var directory = {
    css: {
        dist: 'assets/css',
        root: 'css',
    },
    js: {
        dist: 'assets/js',
        root: 'js',
    },
    img: {
        dist: 'assets/img',
        root: 'img',
    },
    fonts: {
        dist: 'assets/fonts',
        root: 'fonts',
    },
    fav: {
        dist: 'assets/img/favicon',
        root: './',
    },
    html: {
        dist: './pages/',
        root: './',
    }
}

var src = {
    directories: {
        root: 'resources',
        scss: 'resources/assets/sass',
        js: 'resources/assets/scripts',
        img: 'resources/assets/images',
        html: 'resources/views',
    },
    files: {
        scss: '/app.scss',
        js: '/**/*.js',
        img: '/**/*',
        html: '/**/*.+(html|nunjucks)',
    }
}

var app = {
    name: {
        css: 'app.css',
        js: 'app.js',
    }
}

/*
| # SASS
|
| The sass files to be converted as css
| and saved to different folders.
|
| @run  gulp sass
|
*/
gulp.task('sass', function () {
    return sass( src.directories.scss + src.files.scss, { style: 'expanded', loadPath: [
                'bower_components',
            ] } )
            .pipe( sourcemaps.init() )
            .pipe( autoprefixer('last 2 version') )
            .pipe( rename( app.name.css ) )
            .pipe( gulp.dest( directory.css.dist ) )
            .pipe( rename({ suffix: '.min' }) )
            .pipe( cssnano() )
            .pipe( sourcemaps.write('.') )
            .pipe( gulp.dest( directory.css.dist ) )
            .pipe( notify({ message: 'Completed compiling SASS Files' }) );
});

/*
| # Scripts
|
| The js files to be concatinated
| and saved to different folders.
|
| @run  gulp scripts
|
*/
gulp.task('scripts', function () {
    return gulp.src( src.directories.js + src.files.js )
            .pipe( sourcemaps.init() )
            .pipe( concat( app.name.js ) )
            .pipe( gulp.dest( directory.js.dist ) )
            .pipe( rename({ suffix: '.min' }) )
            .pipe( uglify() )
            .pipe( sourcemaps.write('.') )
            .pipe( gulp.dest( directory.js.dist ) )
            .pipe( notify({ message: 'Completed compiling JS Files' }) );
});

/*
| # Images
|
| The img files to be optimized
| and saved to different folders.
|
| @run  gulp images
|
| @destination
|       - ./img/
*/
gulp.task('images', function () {
    return gulp.src( [ src.directories.img + src.files.img ] )
        .pipe( cache( imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }) ) )
        .pipe( gulp.dest( directory.img.dist ) )
        .pipe( notify({ message: 'Images optimization complete' }));
});


/*
| # HTML
|
| @run  gulp html
|
| @destination
|       - ./html/
*/
gulp.task('html', function () {
    gulp.src( src.directories.html + src.files.html )
        .pipe( preprocess({
            context: {
                NODE_ENV: 'production',
                DEBUG: true,
            }
        }) )
        .pipe( gulp.dest( directory.html.dist ) );
});


/*
| # Clean
|
| @run  gulp clean
*/
gulp.task('clean', function () {
    return del([directory.css.dist, directory.js.dist, directory.img.dist]);
});

/*
| # Default Task
|
| @run  gulp default
*/
gulp.task('default', ['clean'], function () {
    gulp.start('sass', 'scripts', 'images', 'html');
});

/*
| # Watcher
|
| @run  gulp watch
*/
gulp.task('watch', function () {
    // Watch stylesheet files
    gulp.watch( src.directories.scss + '/**/*', ['sass']);
    // Watch .js files
    gulp.watch( src.directories.js + '/**/*.js', ['scripts']);
    // Watch image files
    gulp.watch( src.directories.img + '/**/*', ['images']);
    // Watch nunjucks|html files
    gulp.watch( src.directories.html + '/**/*', ['html']);
});