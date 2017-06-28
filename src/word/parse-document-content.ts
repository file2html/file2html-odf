import {parseXML} from 'file2html-xml-tools/lib/sax';
import stringifyStylesheet from '../stringify-stylesheet';

export default function parseDocumentContent (fileContent: string): {styles: string; content: string;} {
    const stylesheet: {[key: string]: string;} = {};
    let content: string = '';

    parseXML(fileContent, {

    });

    return {
        styles: stringifyStylesheet(stylesheet),
        content: `<div>${ content }</div>`
    };
}