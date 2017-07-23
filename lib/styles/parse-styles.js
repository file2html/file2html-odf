"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sax_1 = require("file2html-xml-tools/lib/sax");
var stringify_stylesheet_1 = require("./stringify-stylesheet");
var match_style_tag_1 = require("./match-style-tag");
var create_class_name_1 = require("./create-class-name");
function parseStyles(fileContent) {
    var stylesheet = {
        // reset default browser styles
        '.table': 'border-collapse:collapse;',
        '.image': 'max-width:100%;'
    };
    var selector = '';
    sax_1.parseXML(fileContent, {
        onopentag: function (tagName, attributes) {
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
                    }
                    break;
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
                case 'style:default-style':
                case 'style:style':
                    selector = undefined;
                    break;
                default:
            }
        }
    });
    return stringify_stylesheet_1.default(stylesheet);
}
exports.default = parseStyles;
