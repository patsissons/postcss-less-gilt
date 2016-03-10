/* global describe, xdescribe, it, xit */

import tokenize from '../lib/less-tokenize';

import { expect } from 'chai';
import Input from 'postcss/lib/input';

function testTokens (css, tokens) {
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
