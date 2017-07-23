"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var file2html = require("file2html");
var mime = require("file2html/lib/mime");
var errors_1 = require("file2html/lib/errors");
var file2html_archive_tools_1 = require("file2html-archive-tools");
var parse_meta_1 = require("./parse-meta");
var pictures_1 = require("./pictures");
var parse_styles_1 = require("./styles/parse-styles");
var parse_document_content_1 = require("./word/parse-document-content");
var documentMimeType = mime.lookup('.odt');
var supportedMimeTypes = [documentMimeType];
var ODFReader = (function (_super) {
    __extends(ODFReader, _super);
    function ODFReader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ODFReader.prototype.read = function (_a) {
        var fileInfo = _a.fileInfo;
        var content = fileInfo.content;
        var byteLength = content.byteLength;
        return file2html_archive_tools_1.readArchive(content).then(function (archive) {
            var meta = Object.assign({
                fileType: file2html.FileTypes.document,
                mimeType: '',
                name: '',
                size: byteLength,
                creator: '',
                createdAt: '',
                modifiedAt: ''
            }, fileInfo.meta);
            var dataType = 'string';
            var styles = '';
            var content = '<div></div>';
            if (meta.mimeType === documentMimeType) {
                meta.fileType = file2html.FileTypes.document;
            }
            else {
                // TODO: support other ODF files
                return Promise.reject(new Error('Invalid file format'));
            }
            var queue = [];
            var invalidFileError = errors_1.errorsNamespace + ".invalidFile";
            var fileEntry = archive.file('meta.xml');
            if (fileEntry) {
                queue.push(fileEntry.async(dataType).then(function (data) {
                    return parse_meta_1.default(data, meta);
                }));
            }
            fileEntry = archive.file('styles.xml');
            if (fileEntry) {
                queue.push(fileEntry.async(dataType).then(function (data) {
                    styles += "\n" + parse_styles_1.default(data);
                }));
            }
            fileEntry = archive.file('content.xml');
            if (!fileEntry) {
                return Promise.reject(new Error(invalidFileError));
            }
            queue.push(pictures_1.parsePictures(archive.folder(pictures_1.folderName)).then(function (relations) {
                return fileEntry.async(dataType).then(function (data) {
                    return parse_document_content_1.default(data, {
                        relations: relations
                    });
                }).then(function (data) {
                    styles += "\n" + data.styles;
                    content = data.content;
                });
            }));
            return Promise.all(queue).then(function () { return new file2html.File({
                meta: meta,
                styles: "<style>" + styles + "</style>",
                content: content
            }); });
        });
    };
    ODFReader.testFileMimeType = function (mimeType) {
        return supportedMimeTypes.indexOf(mimeType) >= 0;
    };
    return ODFReader;
}(file2html.Reader));
exports.default = ODFReader;
