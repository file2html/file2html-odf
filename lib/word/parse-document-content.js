"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sax_1 = require("file2html-xml-tools/lib/sax");
var stringify_stylesheet_1 = require("../styles/stringify-stylesheet");
var match_style_tag_1 = require("../styles/match-style-tag");
var create_class_name_1 = require("../styles/create-class-name");
function parseDocumentContent(fileContent) {
    var stylesheet = {};
    var selector = '';
    var content = '';
    sax_1.parseXML(fileContent, {
        onopentag: function (tagName, attributes) {
            switch (tagName) {
                case 'style:style':
                    var name_1 = attributes['style:name'];
                    if (name_1) {
                        selector = "." + create_class_name_1.default(name_1);
                    }
                    break;
                default:
                    if (selector) {
                        stylesheet[selector] = match_style_tag_1.default({
                            tagName: tagName,
                            attributes: attributes,
                            styles: stylesheet[selector] || ''
                        });
                    }
            }
        },
        onclosetag: function (tagName) {
            switch (tagName) {
                case 'style:style':
                    selector = undefined;
                    break;
                default:
            }
        }
    });
    return {
        styles: stringify_stylesheet_1.default(stylesheet),
        content: "<div>" + content + "</div>"
    };
}
exports.default = parseDocumentContent;
