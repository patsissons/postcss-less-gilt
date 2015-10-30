import Comment from 'postcss/lib/comment';
import Parser  from 'postcss/lib/parser';

import lessTokenizer from './less-tokenize';

export default class LessParser extends Parser {

    tokenize() {
        this.tokens = lessTokenizer(this.input);
    }

    comment(token) {
        if ( token[6] === 'inline' ) {
            let node = new Comment();
            this.init(node, token[2], token[3]);
            node.raws.inline = true;
            node.source.end  = { line: token[4], column: token[5] };

            let text = token[1].slice(2);
            if ( /^\s*$/.test(text) ) {
                node.text       = '';
                node.raws.left  = text;
                node.raws.right = '';
            } else {
                let match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
                node.text       = match[2];
                node.raws.left  = match[1];
                node.raws.right = match[3];
            }
        } else {
            super(token);
        }
    }

    // var stringToAtRule = function (str, obj) {
    //     obj.name   = str.match(/^@([^\s]*)/)[1];
    //     obj.params = str.replace(/^@[^\s]*\s+/, '');
    //     return obj;
    // };

    rule(token) {
        let reMixin =
            /^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/;

        super(token);

        if (reMixin.test(this.current.source.input.css)) {
            this.current.type = 'mixin';
        }
    }

}
