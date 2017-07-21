import {parseXML} from 'file2html-xml-tools/lib/sax';
import stringifyStylesheet from '../styles/stringify-stylesheet';
import matchStyleTag from '../styles/match-style-tag';
import createClassName from '../styles/create-class-name';
import {Relations} from '../index';

interface HTMLTags {
    [key: string]: string;
}

export interface DocumentContentParsingOptions {
    relations: Relations;
}

export default function parseDocumentContent (
    fileContent: string,
    options: DocumentContentParsingOptions
): {styles: string; content: string} {
    const {relations} = options;
    const stylesheet: {[key: string]: string} = {};
    const openedHTMLTags: HTMLTags = {
        'text:p': '<p',
        'text:h': '<header',
        'text:section': '<section'
    };
    const closedHTMLTags: HTMLTags = {
        'text:p': '</p>',
        'text:h': '</header>',
        'text:section': '</section>'
    };
    const unfinishedTagEnding: string = '>';
    let selector: string = '';
    let content: string = '';

    parseXML(fileContent, {
        onopentag (tagName: string, attributes: {[key: string]: string}) {
            switch (tagName) {
                case 'style:style':
                    const name: string = attributes['style:name'];

                    if (name) {
                        selector = `.${ createClassName(name) }`;
                    }
                    break;
                case 'text:p':
                case 'text:h':
                case 'text:section':
                    content += openedHTMLTags[tagName];
                    const className: string = attributes['text:style-name'];

                    if (className) {
                        content += ` class="${ className }"`;
                    }

                    content += unfinishedTagEnding;
                    break;
                case 'draw:image':
                    const href: string = attributes['xlink:href'];
                    const src: string = href && relations[href];

                    if (src) {
                        content += `<img id="${ href.split('/').pop() }" src="${ src }"/>`;
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
                case 'text:p':
                case 'text:h':
                case 'text:section':
                    content += closedHTMLTags[tagName];
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