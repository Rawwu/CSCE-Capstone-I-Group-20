const { series, src, dest, parallel, watch } = require("gulp");
const browsersync = require("browser-sync");
const CleanCSS = require("gulp-clean-css");
const del = require("del");
const fileinclude = require("gulp-file-include");
const npmdist = require("gulp-npm-dist");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");
const paths = {
  baseSrc: "src/",
  baseDist: "dist/",
  baseDistAssets: "dist/assets/",
  baseSrcAssets: "src/assets/",
  configTailwind: "./tailwind.config.js",
};
const clean = function (done) {
  del.sync(paths.baseDist, done());
};
const vendor = function () {
  const out = paths.baseDistAssets + "plugins/";
  return src(npmdist(), { base: "./node_modules" })
    .pipe(
      rename(function (path) {
        path.dirname = path.dirname.replace(/\/dist/, "").replace(/\\dist/, "");
      })
    )
    .pipe(dest(out));
};
const html = function () {
  const srcPath = paths.baseSrc + "/";
  const out = paths.baseDist;
  return src([srcPath + "*.html", srcPath + "*.ico", srcPath + "*.png"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
        indent: true,
      })
    )
    .pipe(dest(out));
};
const data = function () {
  const out = paths.baseDistAssets + "data/";
  return src([paths.baseSrcAssets + "data/**/*"]).pipe(dest(out));
};
const fonts = function () {
  const out = paths.baseDistAssets + "fonts/";
  return src([paths.baseSrcAssets + "fonts/**/*"]).pipe(dest(out));
};
const images = function () {
  var out = paths.baseDistAssets + "images";
  return src(paths.baseSrcAssets + "images/**/*").pipe(dest(out));
};
const javascript = function () {
  const out = paths.baseDistAssets + "js/";
  return src(paths.baseSrcAssets + "js/**/*.js")
    .pipe(uglify())
    .pipe(dest(out));
};
const css = function () {
  const out = paths.baseDistAssets + "css/";
  return src(paths.baseSrcAssets + "css/*.css")
    .pipe(sourcemaps.init())
    .pipe(postcss([tailwindcss(paths.configTailwind), autoprefixer()]))
    .pipe(dest(out))
    .pipe(CleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("./"))
    .pipe(dest(out));
};
const initBrowserSync = function (done) {
  const startPath = "/index.html";
  browsersync.init({
    startPath: startPath,
    server: {
      baseDir: paths.baseDist,
      middleware: [
        function (req, res, next) {
          req.method = "GET";
          next();
        },
      ],
    },
  });
  done();
};
const reloadBrowserSync = function (done) {
  browsersync.reload();
  done();
};
function watchFiles() {
  watch(paths.baseSrc + "**/*.html", series([html, css], reloadBrowserSync));
  watch(paths.baseSrcAssets + "data/**/*", series(data, reloadBrowserSync));
  watch(paths.baseSrcAssets + "fonts/**/*", series(fonts, reloadBrowserSync));
  watch(paths.baseSrcAssets + "images/**/*", series(images, reloadBrowserSync));
  watch(paths.baseSrcAssets + "js/**/*", series(javascript, reloadBrowserSync));
  watch(
    [paths.baseSrcAssets + "css/**/*.css", paths.configTailwind],
    series(css, reloadBrowserSync)
  );
}
exports.default = series(
  clean,
  html,
  vendor,
  parallel(data, fonts, images, javascript, css),
  parallel(watchFiles, initBrowserSync)
);
exports.build = series(
  clean,
  html,
  vendor,
  parallel(data, fonts, images, javascript, css)
);
