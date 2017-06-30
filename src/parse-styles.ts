import {parseXML} from 'file2html-xml-tools/lib/sax';
import stringifyStylesheet from './stringify-stylesheet';
import matchStyleTag from './match-style-tag';

export default function parseStyles (fileContent: string): string {
    const stylesheet: {[key: string]: string;} = {
        // reset default browser styles
        '.tbl': 'border-collapse:collapse;'
    };
    let selector: string = '';

    parseXML(fileContent, {
        onopentag (tagName: string, attributes: {family?: string;[key: string]: string}) {
            switch (tagName) {
                case 'style:default-style':
                    switch (attributes.family) {
                        case 'paragraph':
                            selector = 'p';
                            break;
                        case 'table':
                            selector = 'table';
                            break;
                        case 'table-row':
                            selector = 'tr';
                            break;
                    }
                    break;
                case 'style:style':
                    const {name} = attributes;

                    if (name) {
                        selector = `.${ name }`;
                    }
                    break;
                default:
                    if (selector) {
                        stylesheet[selector] = matchStyleTag({
                            tagName,
                            attributes,
                            styles: stylesheet[selector] || ''
                        });
                    }
            }
        },
        onclosetag (tagName: string) {
            switch (tagName) {
                case 'style:default-style':
                case 'style:style':
                    selector = undefined;
                    break;
                default:
                    //
            }
        }
    });

    return stringifyStylesheet(stylesheet);
}