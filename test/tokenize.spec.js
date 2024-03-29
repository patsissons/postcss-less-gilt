/* global describe, xdescribe, it, xit */

import tokenize from '../lib/less-tokenize';

import { expect } from 'chai';
import Input from 'postcss/lib/input';

function testTokens (css, tokens) {
  // console.log(tokenize(new Input(css)));
  expect(tokenize(new Input(css))).to.eql(tokens);
};

describe('#tokenize()', () => {
  it('tokenizes basic css', () => {
    testTokens('a {}', [
      ['word', 'a', 1, 1, 1, 1],
      ['space', ' '],
      ['{', '{', 1, 3],
      ['}', '}', 1, 4]
    ]);
  });

  it('tokenizes css hash colors', () => {
    testTokens('a { border: 1px solid #c0c0c0; }', [
      ['word', 'a', 1, 1, 1, 1],
      ['space', ' '],
      ['{', '{', 1, 3],
      ['space', ' '],
      ['word', 'border', 1, 5, 1, 10],
      [':', ':', 1, 11],
      ['space', ' '],
      ['word', '1px', 1, 13, 1, 15],
      ['space', ' '],
      ['word', 'solid', 1, 17, 1, 21],
      ['space', ' '],
      ['word', '#c0c0c0', 1, 23, 1, 29],
      [';', ';', 1, 30],
      ['space', ' '],
      ['}', '}', 1, 32]
    ]);
  });

  it('tokenizes multiple comma separated values without a space in between', () => {
    testTokens('a { font-family: serif, sans-serif; }', [
      ['word', 'a', 1, 1, 1, 1],
      ['space', ' '],
      ['{', '{', 1, 3],
      ['space', ' '],
      ['word', 'font-family', 1, 5, 1, 15],
      [':', ':', 1, 16],
      ['space', ' '],
      ['word', 'serif', 1, 18, 1, 22],
      ['word', ',', 1, 23, 1, 24],
      ['space', ' '],
      ['word', 'sans-serif', 1, 25, 1, 34],
      [';', ';', 1, 35],
      ['space', ' '],
      ['}', '}', 1, 37]
    ]);
  });

  it('tokenizes unpadded fractional numbers', () => {
    testTokens('a { transition: all .2s; }', [
      ['word', 'a', 1, 1, 1, 1],
      ['space', ' '],
      ['{', '{', 1, 3],
      ['space', ' '],
      ['word', 'transition', 1, 5, 1, 14],
      [':', ':', 1, 15],
      ['space', ' '],
      ['word', 'all', 1, 17, 1, 19],
      ['space', ' '],
      ['word', '.2s', 1, 21, 1, 23],
      [';', ';', 1, 24],
      ['space', ' '],
      ['}', '}', 1, 26]
    ]);
  });

  it('tokenizes the css sibling seletor with a quoted string following', () => {
    testTokens('.a ~ .b { content: ~  "a"; }', [
      ['word', '.a', 1, 1, 1, 2],
      ['space', ' '],
      ['word', '~', 1, 4, 1, 4],
      ['space', ' '],
      ['word', '.b', 1, 6, 1, 7],
      ['space', ' '],
      ['{', '{', 1, 9],
      ['space', ' '],
      ['word', 'content', 1, 11, 1, 17],
      [':', ':', 1, 18],
      ['space', ' '],
      ['word', '~  "a"', 1, 20, 1, 25],
      [';', ';', 1, 26],
      ['space', ' '],
      ['}', '}', 1, 28]
    ]);
  });

  it('tokenizes variables', () => {
    testTokens('@var: 1;', [
      ['word', '@var', 1, 1, 1, 4],
      [':', ':', 1, 5],
      ['space', ' '],
      ['word', '1', 1, 7, 1, 7],
      [';', ';', 1, 8]
    ]);
  });

  it('tokenizes mixins', () => {
    testTokens('.foo (@bar; @baz...) { border: @{baz}; }', [
      ['word', '.foo', 1, 1, 1, 4],
      ['space', ' '],
      ['(', '(', 1, 6],
      ['mixin-param', '@bar', 1, 7, 1, 10],
      [';', ';', 1, 11],
      ['space', ' '],
      ['mixin-param', '@baz...', 1, 13, 1, 19, 'var-dict'],
      [')', ')', 1, 20],
      ['space', ' '],
      ['{', '{', 1, 22],
      ['space', ' '],
      ['word', 'border', 1, 24, 1, 29],
      [':', ':', 1, 30],
      ['space', ' '],
      ['word', '@{baz}', 1, 32, 1, 37],
      [';', ';', 1, 38],
      ['space', ' '],
      ['}', '}', 1, 40]
    ]);
  });

  describe('Comments', () => {
    it('tokenizes inline comments', () => {
      testTokens('// a\n', [
        ['comment', '// a', 1, 1, 1, 4, 'inline'],
        ['space', '\n']
      ]);
    });

    it('tokenizes inline comments in end of file', () => {
      testTokens('// a', [
        ['comment', '// a', 1, 1, 1, 4, 'inline']
      ]);
    });
  });

  describe('Variables', () => {
    it('tokenizes interpolation', () => {
      testTokens('@{a\nb}', [
        ['word', '@{a\nb}', 1, 1, 2, 2]
      ]);
    });

    it('tokenizes @ in a string in parens', () => {
      testTokens('("a@b")', [
        ['(', '(', 1, 1],
        ['string', '"a@b"', 1, 2, 1, 6],
        [')', ')', 1, 7]
      ]);
    });
  });
});
