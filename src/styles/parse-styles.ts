import {parseXML} from 'file2html-xml-tools/lib/sax';
import stringifyStylesheet from './stringify-stylesheet';
import matchStyleTag from './match-style-tag';
import createClassName from './create-class-name';

export default function parseStyles (fileContent: string): string {
    const stylesheet: {[key: string]: string} = {
        // reset default browser styles
        '.table': 'border-collapse:collapse;',
        '.image': 'max-width:100%;'
    };
    let selector: string = '';

    parseXML(fileContent, {
        onopentag (tagName: string, attributes: {[key: string]: string}) {
            switch (tagName) {
                case 'style:default-style':
                    switch (attributes['style:family']) {
                        case 'paragraph':
                            selector = 'p';
                            break;
                        case 'table':
                        case 'table-row':
                            selector = tagName;
                            break;
                        default:
                            //
                    }
                    break;
                case 'style:style':
                    const name: string = attributes['style:name'];

                    if (name) {
                        selector = `.${ createClassName(name) }`;
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