"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sax_1 = require("file2html-xml-tools/lib/sax");
var stringify_stylesheet_1 = require("../styles/stringify-stylesheet");
var match_style_tag_1 = require("../styles/match-style-tag");
var create_class_name_1 = require("../styles/create-class-name");
function parseDocumentContent(fileContent, options) {
    var relations = options.relations;
    var stylesheet = {};
    var openedHTMLTags = {
        'text:p': '<p',
        'text:h': '<header',
        'text:section': '<section'
    };
    var closedHTMLTags = {
        'text:p': '</p>',
        'text:h': '</header>',
        'text:section': '</section>'
    };
    var unfinishedTagEnding = '>';
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
                case 'text:p':
                case 'text:h':
                case 'text:section':
                    content += openedHTMLTags[tagName];
                    var className = attributes['text:style-name'];
                    if (className) {
                        content += " class=\"" + className + "\"";
                    }
                    content += unfinishedTagEnding;
                    break;
                case 'draw:image':
                    var href = attributes['xlink:href'];
                    var src = href && relations[href];
                    if (src) {
                        content += "<img id=\"" + href.split('/').pop() + "\" src=\"" + src + "\"/>";
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
                case 'text:p':
                case 'text:h':
                case 'text:section':
                    content += closedHTMLTags[tagName];
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
