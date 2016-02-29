/* global __dirname */

// import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import real from 'postcss-parser-tests/real';
import register from 'babel-core/register';

import gulp from 'gulp';
import clean from 'gulp-rimraf';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';
// import jsonEditor from 'gulp-json-editor';

const config = {
  dirs: {
    lib: path.join(__dirname, 'lib'),
    test: path.join(__dirname, 'test'),
    build: path.join(__dirname, 'build')
  },
  builds: {
    lib: 'lib',
    docs: 'docs',
    package: 'package'
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

gulp.task('clean:all', ['clean:lib', 'clean:docs', 'clean:package'], () => {
  return gulp
    .src(config.dirs.build, { read: false })
    .pipe(clean());
});

gulp.task('clean:lib', () => {
  return gulp
    .src(path.join(config.dirs.build, config.builds.lib), { read: false })
    .pipe(clean());
});

gulp.task('clean:docs', () => {
  return gulp
    .src(path.join(config.dirs.build, config.builds.docs), { read: false })
    .pipe(clean());
});

gulp.task('clean:package', () => {
  return gulp
    .src(path.join(config.dirs.build, config.builds.package), { read: false })
    .pipe(clean());
});

// Build

gulp.task('build', ['build:all']);
gulp.task('build:all', ['build:lib', 'build:docs', 'build:package']);

gulp.task('build:lib', ['clean:lib'], () => {
  return gulp
    .src(path.join(config.dirs.lib, '*.es6'))
    .pipe(babel())
    .pipe(gulp.dest(path.join(config.dirs.build, config.builds.lib)));
});

gulp.task('build:docs', ['clean:docs'], () => {
  // let ignore = fs
  //   .readFileSync(path.join(__dirname, '.npmignore'))
  //   .toString()
  //   .trim()
  //   .split(/(\r?\n)+/)
  //   .concat(['.npmignore', 'package.json', 'index.js'])
  //   .map(i => `!${i}`);

  // return gulp
  //   .src(['*'].concat(ignore))
  //   .pipe(gulp.dest(config.dirs.build));
});

gulp.task('build:package', ['clean:package'], () => {
  // gulp
  //   .src(path.join(__dirname, 'package.json'))
  //   .pipe(jsonEditor(p => {
  //     p.main = 'lib/less-syntax';
  //     p.devDependencies['babel-core'] = p.dependencies['babel-core'];
  //     delete p.dependencies['babel-core'];
  //     return p;
  //   }))
  //   .pipe(gulp.dest('build'));
});

// Lint

gulp.task('lint', ['lint:all']);

gulp.task('lint:all', ['lint:lib', 'lint:test'], () => {
  return gulp
    .src(path.join(__dirname, '*.js'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint:lib', () => {
  return gulp
    .src(path.join(config.dirs.lib, '**', '*.es6'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint:test', () => {
  return gulp
    .src(path.join(config.dirs.test, '**', '*.es6'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Test

gulp.task('test', ['lint', 'test:run']);

gulp.task('test:all', ['lint', 'test:run', 'test:integration']);

gulp.task('test:run', () => {
  register({ extensions: ['.es6'], ignore: false });

  return gulp
    .src(path.join(config.dirs.test, '**', '*.es6'), { read: false })
    .pipe(mocha({ reporter: config.test.reporter }));
});

gulp.task('test:integration', (done) => {
  register({ extensions: ['.es6'], ignore: false });
  let less = require('./index.js').default;

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
      path.join(config.dirs.lib, '**', '*.es6'),
      path.join(config.dirs.test, '**', '*.es6')
    ], ['lint']);
});

gulp.task('watch:test', ['test:run'], () => {
  return gulp
    .watch([
      path.join(config.dirs.lib, '**', '*.es6'),
      path.join(config.dirs.test, '**', '*.es6')
    ], ['test:run']);
});
