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
        'text:section': '<section',
        'text:span': '<span',
        'text:a': '<a',
        'text:list': '<ul',
        'text:list-item': '<li',
        'table:table': '<table',
        'table:table-row': '<tr',
        'table:table-cell': '<td'
    };
    const closedHTMLTags: HTMLTags = {
        'text:p': '</p>',
        'text:h': '</header>',
        'text:section': '</section>',
        'text:span': '</span>',
        'text:a': '</span>',
        'text:list': '</ul>',
        'text:list-item': '</li>',
        'table:table': '</table>',
        'table:table-row': '</tr>',
        'table:table-cell': '</td>'
    };
    const unfinishedTagEnding: string = '>';
    let selector: string = '';
    let content: string = '';
    let isTextContentEnabled: boolean;

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
                case 'text:span':
                case 'text:a':
                case 'text:list':
                case 'text:list-item':
                case 'table:table':
                case 'table:table-row':
                case 'table:table-cell':
                    isTextContentEnabled = true;
                    content += openedHTMLTags[tagName];
                    const className: string = attributes['text:style-name'];

                    if (className) {
                        content += ` class="${ className }"`;
                    }

                    const href: string = attributes['xlink:href'];

                    if (href) {
                        content += ` href="${ href }"`;
                    }

                    content += unfinishedTagEnding;
                    break;
                case 'draw:image':
                    const imageHref: string = attributes['xlink:href'];
                    const src: string = href && relations[imageHref];

                    if (src) {
                        content += `<img id="${ imageHref.split('/').pop().split('.')[0] }" src="${ src }"/>`;
                    }
                    break;
                case 'text:bookmark':
                    const bookmarkName: string = attributes['text:name'];

                    if (bookmarkName) {
                        content += `<a name="${ bookmarkName }"></a>`;
                    }

                    break;
                case 'text:s':
                    content += '\u0020';
                    break;
                case 'text:tab':
                    content += '\u0009';
                    break;
                case 'text:line-break':
                    content += '<br/>';
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
                case 'text:span':
                case 'text:a':
                case 'text:list':
                case 'text:list-item':
                case 'table:table':
                case 'table:table-row':
                case 'table:table-cell':
                    isTextContentEnabled = false;
                    content += closedHTMLTags[tagName];
                    break;
                default:
                //
            }
        },
        ontext (textContent: string) {
            content += textContent;
        }
    });

    return {
        styles: stringifyStylesheet(stylesheet),
        content: `<div>${ content }</div>`
    };
}