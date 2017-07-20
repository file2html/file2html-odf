"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cssRules = [
    'color',
    'background-color',
    'border',
    'border-top',
    'border-bottom',
    'border-left',
    'border-right',
    'font-family',
    'font-size',
    'font-style',
    'font-variant',
    'font-weight',
    'height',
    'letter-spacing',
    'margin',
    'margin-top',
    'margin-bottom',
    'margin-left',
    'margin-right',
    'max-height',
    'max-width',
    'min-height',
    'min-width',
    'padding',
    'padding-top',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'text-align',
    'text-indent',
    'text-shadow',
    'text-transform',
    'width',
    'direction',
    'vertical-align'
];
function matchStyleTag(_a) {
    var tagName = _a.tagName, attributes = _a.attributes, styles = _a.styles;
    switch (tagName) {
        case 'style:paragraph-properties':
        case 'style:table-properties':
        case 'style:text-properties':
        case 'style:table-column-properties':
        case 'style:table-row-properties':
        case 'style:table-cell-properties':
            cssRules.forEach(function (rule) {
                var value = attributes["fo:" + rule];
                if (value) {
                    styles += rule + ":" + value + ";";
                }
            });
            var lineHeight = attributes['fo:line-height'];
            var shadow = attributes['fo:shadow'];
            if (lineHeight) {
                if (lineHeight === 'normal') {
                    lineHeight = '1';
                }
                styles += "line-height:" + lineHeight + ";";
            }
            if (shadow) {
                styles += "box-shadow:" + shadow + ";";
            }
            break;
        default:
    }
    return styles;
}
exports.default = matchStyleTag;
