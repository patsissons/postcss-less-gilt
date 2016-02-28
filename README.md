# PostCSS LESS Syntax - Work in Progress

[PostCSS]: https://github.com/postcss/postcss
[PostCSS-SCSS]: https://github.com/postcss/postcss-scss
[LESS]: http://lesless.org
[Autoprefixer]: https://github.com/postcss/autoprefixer
[Stylelint]: http://stylelint.io/

[ci]: https://travis-ci.org/postcss/postcss-less
[ci-img]: https://img.shields.io/travis/postcss/postcss-less.svg?branch=master
[npm]: https://www.npmjs.com/package/postcss-less
[npm-dls]: https://img.shields.io/npm/dt/postcss-less.svg
[npm-license]: https://img.shields.io/npm/l/postcss-less.svg

> This project is not stable and is in development. If you'd like to contribute, please submit a Pull Request.

> Built from the [postcss-scss]([PostCSS-SCSS]) SCSS Syntax Parser.

<img align="right" width="95" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo.svg">

[![Build Status]([ci-img])]([ci])
[![Downloads]([npm-dls])]([npm])
[![License]([npm-license])]([npm])

A [LESS] parser for [PostCSS].

**This module does not compile LESS.** It simply parses mixins as custom
at-rules & variables as properties, so that PostCSS plugins can then transform
LESS source code alongside CSS.

## Usage

### LESS Transformations

The main use case of this plugin is to apply PostCSS transformations directly
to LESS source code. For example, if you ship a theme written in LESS and need
[Autoprefixer] to add the appropriate vendor prefixes to it; or you need to
lint LESS with a plugin such as [Stylelint].

```js
var syntax = require('postcss-less');
postcss(plugins).process(less, { syntax: syntax }).then(function (result) {
    result.content // LESS with transformations
});
```

### Inline Comments for PostCSS

This module also enables parsing of single-line comments in CSS source code.

```less
:root {
    // Main theme color
    --color: red;
}
```

Note that you don't need a special stringifier to handle the output; the default
one will automatically convert single line comments into block comments.

```js
var syntax = require('postcss-less');
postcss(plugins).process(less, { parser: syntax }).then(function (result) {
    result.css // CSS with normal comments
});
```
