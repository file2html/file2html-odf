export interface TagStyleMatchProps {
    tagName: string;
    attributes: {[key: string]: string;};
    styles: string;
}

const borderRules: string[] = ['border', 'border-top', 'border-bottom', 'bottom-left', 'border-right'];

export default function matchStyleTag ({tagName, attributes, styles}: TagStyleMatchProps): string {
    switch (tagName) {
        case 'style:paragraph-properties':
            const bgColor: string = attributes['fo:background-color'];

            if (bgColor) {
                styles += `background-color:${ bgColor };`;
            }

            borderRules.forEach((rule: string) => {
                const value: string = attributes[`fo:${ rule }`];

                if (value) {
                    styles += `${ rule }:${ value };`;
                }
            });

            break;
        default:
            //
    }

    return styles;
}