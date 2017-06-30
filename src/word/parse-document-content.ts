import {parseXML} from 'file2html-xml-tools/lib/sax';
import stringifyStylesheet from '../stringify-stylesheet';
import matchStyleTag from '../match-style-tag';

export default function parseDocumentContent (fileContent: string): {styles: string; content: string;} {
    const stylesheet: {[key: string]: string;} = {};
    let selector: string = '';
    let content: string = '';

    parseXML(fileContent, {
        onopentag (tagName: string, attributes: {[key: string]: string}) {
            switch (tagName) {
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
                case 'style:style':
                    selector = undefined;
                    break;
                default:
                //
            }
        }
    });

    return {
        styles: stringifyStylesheet(stylesheet),
        content: `<div>${ content }</div>`
    };
}