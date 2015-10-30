import LessStringifier from './less-stringifier';

export default function lessStringify(node, builder) {
    let str = new LessStringifier(builder);
    str.stringify(node);
}
