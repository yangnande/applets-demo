const gulp = require('gulp')
const dateformat = require('dateformat')
const zip = require('gulp-zip')
// const sftp = require('gulp-fez-sftp') // https://github.com/gtg092x/gulp-sftp 修改版)
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const mozjpeg = require('imagemin-mozjpeg')
const del = require('del')
const copy = require('copy-paste')
const now = new Date()
const zipName = dateformat(now, 'yyyymmddHHMM') + 'leadeon-wx-rs.zip'

// 复制压缩包名字
copy.copy(zipName, _ => {
  console.log('复制压缩包名字成功')
})

// 删除静态资源
const cleanStatic = () => del(['【静态资源】'])

// 压缩图片
const compressImage = () => {
  return gulp.src('dist/wx/static/img/**/*.{jpg,png,gif,svg}')
    .pipe(imagemin([
      pngquant({quality: '60'}),
      mozjpeg({quality: 60})
    ]))
    // 输出到当前目录
    .pipe(gulp.dest('【静态资源】/leadeon-wx-rs/static/img'))
}

// 删除 dist 中的图片
const cleanDistImage = () => del(['dist/wx/static/img'])

// 生成压缩包
const rar = () => {
  return gulp.src('【静态资源】/leadeon-wx-rs/**/*', {base: '【静态资源】'})
    .pipe(zip(zipName))
    .pipe(gulp.dest('【静态资源】'))
}

gulp.task('default', gulp.series(cleanStatic, compressImage, rar, cleanDistImage))
