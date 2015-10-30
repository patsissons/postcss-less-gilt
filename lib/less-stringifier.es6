import Stringifier from 'postcss/lib/stringifier';

export default class LessStringifier extends Stringifier {

    comment(node) {
        let left  = this.raw(node, 'left',  'commentLeft');
        let right = this.raw(node, 'right', 'commentRight');

        if ( node.raws.inline ) {
            this.builder('//' + left + node.text + right, node);
        } else {
            this.builder('/*' + left + node.text + right + '*/', node);
        }
    }

}
