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
        'text:section': '<section',
        'text:span': '<span',
        'text:a': '<a',
        'text:list': '<ul',
        'text:list-item': '<li',
        'table:table': '<table',
        'table:table-row': '<tr',
        'table:table-cell': '<td'
    };
    var closedHTMLTags = {
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
    var unfinishedTagEnding = '>';
    var selector = '';
    var content = '';
    var isTextContentEnabled;
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
                case 'text:span':
                case 'text:a':
                case 'text:list':
                case 'text:list-item':
                case 'table:table':
                case 'table:table-row':
                case 'table:table-cell':
                    isTextContentEnabled = true;
                    content += openedHTMLTags[tagName];
                    var className = attributes['text:style-name'];
                    if (className) {
                        content += " class=\"" + className + "\"";
                    }
                    var href = attributes['xlink:href'];
                    if (href) {
                        content += " href=\"" + href + "\"";
                    }
                    content += unfinishedTagEnding;
                    break;
                case 'draw:image':
                    var imageHref = attributes['xlink:href'];
                    var src = imageHref && relations[imageHref];
                    if (src) {
                        content += "<img id=\"" + imageHref.split('/').pop().split('.')[0] + "\" src=\"" + src + "\"/>";
                    }
                    break;
                case 'text:bookmark':
                    var bookmarkName = attributes['text:name'];
                    if (bookmarkName) {
                        content += "<a name=\"" + bookmarkName + "\"></a>";
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
            }
        },
        ontext: function (textContent) {
            content += textContent;
        }
    });
    return {
        styles: stringify_stylesheet_1.default(stylesheet),
        content: "<div>" + content + "</div>"
    };
}
exports.default = parseDocumentContent;
