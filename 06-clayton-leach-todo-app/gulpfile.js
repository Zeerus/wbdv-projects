// * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// PATHS
// * * * * * * * * * * * * * * * * * * * * * * * * * * * *
const path = {
    sass: './src/scss',
    css: './src'
}



// * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Code
// * * * * * * * * * * * * * * * * * * * * * * * * * * * *
const gulp          = require('gulp')
const sass          = require('gulp-sass')
const allSassFiles  = path.sass + '/**/*.scss'

gulp.task('style', () => {
    gulp.src(path.sass + '/App.scss')
        .pipe(sass())
        .pipe(gulp.dest(path.css))
})

gulp.task('watch', () => {
    gulp.watch(allSassFiles, ['style'])
})
