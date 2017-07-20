"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sax_1 = require("file2html-xml-tools/lib/sax");
function parseMeta(fileContent, fileMetaInformation) {
    var metaInfoProp;
    sax_1.parseXML(fileContent, {
        onopentag: function (tagName) {
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
        onclosetag: function () {
            metaInfoProp = undefined;
        },
        ontext: function (textContent) {
            if (metaInfoProp) {
                fileMetaInformation[metaInfoProp] = textContent;
            }
        }
    });
}
exports.default = parseMeta;
