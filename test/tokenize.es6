/* global describe, xdescribe, it, xit */

import tokenize from '../lib/less-tokenize';

import { expect } from 'chai';
import Input from 'postcss/lib/input';

let test = (css, tokens) => {
  expect(tokenize(new Input(css))).to.eql(tokens);
};

describe('LESS Tokenizer', () => {
  it('tokenizes inine comments', () => {
    test('// a\n', [
      ['comment', '// a', 1, 1, 1, 4, 'inline'],
      ['space', '\n']
    ]);
  });

  it('tokenizes inine comments in end of file', () => {
    test('// a', [
      ['comment', '// a', 1, 1, 1, 4, 'inline']
    ]);
  });

  it('tokenizes interpolation', () => {
    test('@{a\nb}', [
      ['word', '@{a\nb}', 1, 1, 2, 2]
    ]);
  });

  it('tokenizes @ in a string in parens', () => {
    test('("a@b")', [
      ['(', '(', 1, 1],
      ['string', '"a@b"', 1, 2, 1, 6],
      [')', ')', 1, 7]
    ]);
  });
});
