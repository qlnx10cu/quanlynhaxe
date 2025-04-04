/**
 * Tasks:
 *
 * gulp sounds
 *   Generate lib/sounds.json (it must be manually called)
 *
 * gulp prod
 *   Generates the app in production mode
 *
 * gulp dev
 *   Generates the app in development mode
 *
 * gulp live
 *   Generates the app in development mode, opens the local website and
 *   watches for changes
 *
 * gulp
 *   Alias for `gulp prod`
 */

const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const gulpif = require("gulp-if");
const gutil = require("gulp-util");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const header = require("gulp-header");
const replace = require("gulp-replace");
const browserify = require("browserify");
const watchify = require("watchify");
const envify = require("envify/custom");
const uglify = require("gulp-uglify-es").default;
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const del = require("del");
const mkdirp = require("mkdirp");
const ncp = require("ncp");
const eslint = require("gulp-eslint");
const nodemon = require("gulp-nodemon");
const browserSync = require("browser-sync");
require("dotenv").config();

/* eslint-disable import/extensions */
const PKG = require("./package.json");
const BANNER = fs.readFileSync("banner.txt").toString();
/* eslint-enable import/extensions */

const BANNER_OPTIONS = {
    pkg: PKG,
    currentYear: new Date().getFullYear(),
};

let OUTPUT_DIR = "../MuoiCu_Server/public";
let VERSION_APP = new Date().getTime();

// Default environment
process.env.NODE_ENV = "development";

function logError(error) {
    gutil.log(gutil.colors.red(String(error)));
}

function bundle(options) {
    options = options || {};

    const watch = Boolean(options.watch);
    let bundler = browserify({
        entries: path.join(__dirname, PKG.main),
        extensions: [".js", ".jsx"],
        // required for sourcemaps (must be false otherwise)
        debug: process.env.NODE_ENV === "development",
        // required for watchify
        cache: {},
        // required for watchify
        packageCache: {},
        // required to be true only for watchify
        fullPaths: watch,
        // Don"t parse clone dep (not needed)
        noParse: ["clone"],
    })
        .transform("babelify")
        .transform(
            envify({
                NODE_ENV: process.env.NODE_ENV,
                API_HOST: process.env.API_HOST,
                _: "purge",
            })
        );

    if (watch) {
        bundler = watchify(bundler);

        bundler.on("update", () => {
            const start = Date.now();

            gutil.log("bundling...");
            rebundle();
            gutil.log("bundle took %sms", Date.now() - start);
        });
    }

    function rebundle() {
        return bundler
            .bundle()
            .on("error", logError)
            .pipe(source(`${PKG.name}.js`))
            .pipe(buffer())
            .pipe(rename(`${PKG.name}.js`))
            .pipe(gulpif(process.env.NODE_ENV === "production", uglify()))
            .pipe(header(BANNER, BANNER_OPTIONS))
            .pipe(gulp.dest(OUTPUT_DIR));
    }

    return rebundle();
}

gulp.task("env", (done) => {
    console.log("Loaded ENV Variable:", process.env.API_HOST);
    done();
});

gulp.task("clean", (done) => {
    del(OUTPUT_DIR + "/resources", { force: true });
    del(OUTPUT_DIR + "/index.html", { force: true });
    del(OUTPUT_DIR + "/app.js", { force: true });
    done();
});

gulp.task("env:dev", (done) => {
    gutil.log("setting 'dev' environment");

    process.env.NODE_ENV = "development";
    OUTPUT_DIR = "build";
    VERSION_APP = "1.0.0";

    done();
});

gulp.task("env:prod", (done) => {
    gutil.log("setting 'prod' environment");

    process.env.NODE_ENV = "production";
    done();
});

gulp.task("lint", () => {
    const src = ["gulpfile.js", "src/**/*.js", "src/**/*.jsx"];

    return gulp.src(src).pipe(plumber()).pipe(eslint()).pipe(eslint.format());
});

gulp.task("css", (done) => {
    done();
});

gulp.task("html", () => {
    return gulp
        .src("public/index.html")
        .pipe(replace(/{{VERSION_APP}}/, VERSION_APP))
        .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task("resources", (done) => {
    const dst = path.join(OUTPUT_DIR, "resources");

    mkdirp.sync(dst);
    ncp("public/resources", dst, { stopOnErr: true }, (error) => {
        if (error && error[0].code !== "ENOENT") throw new Error(`resources copy failed: ${error}`);

        done();
    });
});

gulp.task("bundle", () => {
    return bundle({ watch: false });
});

gulp.task("bundle:watch", () => {
    return bundle({ watch: true });
});

gulp.task("openbrowser", (done) => {
    browserSync({
        proxy: "http://localhost:5000",
    });
    done();
});

gulp.task("watch", (done) => {
    // Watch changes in HTML
    gulp.watch(["index.html"], gulp.series("html"));

    // Watch changes in Stylus files
    gulp.watch(["stylus/**/*.styl"], gulp.series("css"));

    // Watch changes in resources
    gulp.watch(["resources/**/*"], gulp.series("resources", "css"));

    // Watch changes in JS files
    gulp.watch(["gulpfile.js", "src/**/*.js", "src/**/*.jsx"], gulp.series("lint"));

    done();
});

gulp.task("nodemon", function (done) {
    var started = false;
    return nodemon({
        script: "server.js",
    }).on("start", function () {
        if (!started) {
            started = true;
            done();
        }
    });
});

gulp.task("prod", gulp.series("env", "env:prod", "clean", "lint", "bundle", "html", "css", "resources"));

gulp.task("dev", gulp.series("env", "env:dev", "clean", "lint", "bundle", "html", "css", "resources"));

gulp.task("live", gulp.series("env", "env:dev", "clean", "lint", "bundle:watch", "html", "css", "resources", "watch", "nodemon", "openbrowser"));

gulp.task("default", gulp.series("prod"));
