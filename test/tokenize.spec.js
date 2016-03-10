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
