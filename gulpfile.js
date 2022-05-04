import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import rename from 'gulp-rename';
import csso from 'postcss-csso';
import postcss from 'gulp-postcss';
import del from 'del'
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';

// CSS

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'));
  }

// Scripts

const scripts = () => {
  return gulp.src('source/js/script.js')
  .pipe(terser())
  .pipe(rename("script.min.js"))
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
  }

// Copy fonts
const copyFonts = () => {
  return gulp.src('source/fonts/*.{woff,woff2}')
  .pipe(gulp.dest('build/fonts'))
}

// Copy favicon
const copyIco = () => {
  return gulp.src('*.ico')
  .pipe(gulp.dest('build'))
}

// Optimize Images

const optimizeImages = () => {
  return gulp.src(['source/img/**/*.{png,jpg}', '!source/img/favicons/*.png'])
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
  }

// WebP

const createWebp = () => {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(squoosh({webp: {}}))
    .pipe(gulp.dest("build/img"));
  }

// SVG

const svg = () =>
gulp.src('source/img/**/*.svg')
.pipe(svgo())
.pipe(gulp.dest('build/img'));

// SVG Sprite

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(svgo())
  .pipe(svgstore({
  inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
  }

// Copy images

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'))
}

// Clean

export const clean = () => {
  return del('build');
  };

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
  }

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/.html', gulp.series(html, reload));
  }

// Build

export const build = gulp.series(
  clean,
  copyFonts,
  copyIco,
  optimizeImages,
  svg,
  gulp.parallel(
  createWebp,
  styles,
  html,
  scripts,
  sprite,
  ),
  );

export default gulp.series(
  clean,
  copyFonts,
  copyImages,
  svg,
  gulp.parallel(
  createWebp,
  copyIco,
  styles,
  html,
  scripts,
  sprite,
  ),
  gulp.series(
  server,
  watcher
)
);
