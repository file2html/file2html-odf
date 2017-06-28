import {parseXML} from 'file2html-xml-tools/lib/sax';
import stringifyStylesheet from './stringify-stylesheet';

export default function parseStyles (fileContent: string): string {
    const stylesheet: {[key: string]: string;} = {};
    let selector: string = '';

    parseXML(fileContent, {
        onopentag (tagName: string, attrs: {[key: string]: string}) {
            switch (tagName) {
                case 'style:default-style':
                    switch (attrs.family) {
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
                case 'style:paragraph-properties':
                    break;
                default:
                    //
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