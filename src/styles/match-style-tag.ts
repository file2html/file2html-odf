export interface TagStyleMatchProps {
    tagName: string;
    attributes: {[key: string]: string;};
    styles: string;
}

const cssRules: string[] = [
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

export default function matchStyleTag ({tagName, attributes, styles}: TagStyleMatchProps): string {
    switch (tagName) {
        case 'style:paragraph-properties':
        case 'style:table-properties':
        case 'style:text-properties':
        case 'style:table-column-properties':
        case 'style:table-row-properties':
        case 'style:table-cell-properties':
            cssRules.forEach((rule: string) => {
                const value: string = attributes[`fo:${ rule }`];

                if (value) {
                    styles += `${ rule }:${ value };`;
                }
            });

            let lineHeight: string = attributes['fo:line-height'];
            const shadow: string = attributes['fo:shadow'];

            if (lineHeight) {
                if (lineHeight === 'normal') {
                    lineHeight = '1';
                }

                styles += `line-height:${ lineHeight };`;
            }

            if (shadow) {
                styles += `box-shadow:${ shadow };`;
            }

            break;
        default:
            //
    }

    return styles;
}