import Input from 'postcss/lib/input';

import LessParser from './less-parser';

export default function lessParse(less, opts) {
    let input = new Input(less, opts);

    let parser = new LessParser(input);
    parser.tokenize();
    parser.loop();

    return parser.root;
}
