/* global __dirname */

import path from 'path';
import postcss from 'postcss';
import real from 'postcss-parser-tests/real';

import gulp from 'gulp';
import clean from 'gulp-rimraf';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';

const config = {
  dirs: {
    lib: path.join(__dirname, 'lib'),
    test: path.join(__dirname, 'test'),
    build: path.join(__dirname, 'build'),
    dist: path.join(__dirname, 'dist')
  },
  builds: {
    lib: 'lib',
    test: 'test'
  },
  test: {
    reporter: 'spec'
  }
};

gulp.task('default', ['test']);

gulp.task('config', () => {
  console.log(JSON.stringify(config, null, 2));
});

// Clean

gulp.task('clean', ['clean:all']);

gulp.task('clean:all', ['clean:build', 'clean:dist']);

gulp.task('clean:lib', () => {
  return gulp
    .src(path.join(config.dirs.build, config.builds.lib), { read: false })
    .pipe(clean());
});

gulp.task('clean:test', () => {
  return gulp
    .src(path.join(config.dirs.build, config.builds.test), { read: false })
    .pipe(clean());
});

gulp.task('clean:build', () => {
  return gulp
    .src(config.dirs.build, { read: false })
    .pipe(clean());
});

gulp.task('clean:dist', () => {
  return gulp
    .src(path.join(config.dirs.dist), { read: false })
    .pipe(clean());
});

// Build

gulp.task('build', ['build:all']);
gulp.task('build:all', ['build:lib', 'build:test']);

gulp.task('build:lib', ['clean:lib'], () => {
  return gulp
    .src(path.join(config.dirs.lib, '*.js'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest(path.join(config.dirs.build, config.builds.lib)));
});

gulp.task('build:test', ['clean:test', 'build:lib'], () => {
  return gulp
    .src(path.join(config.dirs.test, '*.js'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest(path.join(config.dirs.build, config.builds.test)));
});

// Lint

gulp.task('lint', ['lint:all']);

gulp.task('lint:all', ['lint:lib', 'lint:test', 'lint:root']);

gulp.task('lint:lib', () => {
  return gulp
    .src(path.join(config.dirs.lib, '**', '*.js'))
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint:test', () => {
  return gulp
    .src(path.join(config.dirs.test, '**', '*.js'))
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint:root', () => {
  return gulp
    .src(path.join(__dirname, '*.js'))
    .pipe(eslint())
    .pipe(eslint.format());
});

// Test

gulp.task('test', ['lint', 'test:run']);

gulp.task('test:all', ['lint', 'test:run', 'test:integration']);

gulp.task('test:run', ['build:test'], () => {
  return gulp
    .src(path.join(config.dirs.build, config.builds.test, '**', '*.js'), { read: false })
    .pipe(mocha({ reporter: config.test.reporter }))
    .on('error', function () { this.emit('end'); });
});

gulp.task('test:integration', ['build:lib'], (done) => {
  let less = require('./build/lib/less-syntax').default;

  real(done, (css) => {
    return postcss()
      .process(css, {
        parser: less,
        map: { annotation: false }
      });
  });
});

// Watch

gulp.task('watch', ['watch:test']);

gulp.task('watch:lint', ['lint'], () => {
  return gulp
    .watch([
      path.join(config.dirs.lib, '**', '*.js'),
      path.join(config.dirs.test, '**', '*.js'),
      path.join(__dirname, '*.js')
    ], ['lint']);
});

gulp.task('watch:test', ['test:run'], () => {
  return gulp
    .watch([
      path.join(config.dirs.lib, '**', '*.js'),
      path.join(config.dirs.test, '**', '*.js')
    ], ['test:run']);
});

// Dist

gulp.task('dist', ['build:lib'], () => {
  gulp
    .src(path.join(config.dirs.build, config.builds.lib, '**', '*.js'))
    .pipe(gulp.dest(config.dirs.dist));

  gulp
    .src(path.join(config.dirs.build, config.builds.lib, '**', '*.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dirs.dist));
});
