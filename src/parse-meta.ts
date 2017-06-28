import {parseXML} from 'file2html-xml-tools/lib/sax';
import {FileMetaInformation} from 'file2html';

export default function parseMeta (fileContent: string, fileMetaInformation: FileMetaInformation) {
    let metaInfoProp: string;

    parseXML(fileContent, {
        onopentag (tagName: string) {
            switch (tagName) {
                case 'meta:initial-creator':
                    metaInfoProp = 'creator';
                    break;
                case 'meta:creation-date':
                    metaInfoProp = 'createdAt';
                    break;
                case 'dc:date':
                    metaInfoProp = 'modifiedAt';
                    break;
                default:
                    metaInfoProp = undefined;
            }
        },
        onclosetag () {
            metaInfoProp = undefined;
        },
        ontext (textContent: string) {
            if (metaInfoProp) {
                fileMetaInformation[metaInfoProp] = textContent;
            }
        }
    });
}