import * as file2html from 'file2html';
import * as mime from 'file2html/lib/mime';
import {errorsNamespace} from 'file2html/lib/errors';
import {readArchive, Archive, ArchiveEntry, ArchiveEntrySerialization} from 'file2html-archive-tools';
import parseMeta from './parse-meta';
import {parsePictures, folderName} from './pictures';
import parseStyles from './styles/parse-styles';
import parseDocumentContent from './word/parse-document-content';

const documentMimeType: string = mime.lookup('.odt');
const supportedMimeTypes: string[] = [documentMimeType];

export interface Relations {
    [key: string]: string;
}

export default class ODFReader extends file2html.Reader {
    read ({fileInfo}: file2html.ReaderParams) {
        const {content} = fileInfo;
        const {byteLength} = content;

        return readArchive(content).then((archive: Archive) => {
            const meta: file2html.FileMetaInformation = Object.assign({
                fileType: file2html.FileTypes.document,
                mimeType: '',
                name: '',
                size: byteLength,
                creator: '',
                createdAt: '',
                modifiedAt: ''
            }, fileInfo.meta);
            const dataType: ArchiveEntrySerialization = 'string';
            let styles: string = '';
            let content: string = '<div></div>';

            if (meta.mimeType === documentMimeType) {
                meta.fileType = file2html.FileTypes.document;
            } else {
                // TODO: support other ODF files
                return Promise.reject(new Error('Invalid file format')) as any;
            }

            const queue: Promise<any>[] = [];
            const invalidFileError: string = `${ errorsNamespace }.invalidFile`;
            let fileEntry: ArchiveEntry = archive.file('meta.xml');

            if (fileEntry) {
                queue.push(fileEntry.async(dataType).then((data: string) => {
                    return parseMeta(data, meta);
                }));
            }

            fileEntry = archive.file('styles.xml');

            if (fileEntry) {
                queue.push(fileEntry.async(dataType).then((data: string) => {
                    styles += `\n${ parseStyles(data) }`;
                }));
            }


            fileEntry = archive.file('content.xml');

            if (!fileEntry) {
                return Promise.reject(new Error(invalidFileError)) as any;
            }

            queue.push(parsePictures(archive.folder(folderName)).then((relations: Relations) => {
                return fileEntry.async(dataType).then((data: string) => {
                    return parseDocumentContent(data, {
                        relations
                    });
                }).then((data: {styles: string; content: string}) => {
                    styles += `\n${ data.styles }`;
                    content = data.content;
                });
            }));

            return Promise.all(queue).then(() => new file2html.File({
                meta,
                styles: `<style>${ styles }</style>`,
                content
            }));
        });
    }

    static testFileMimeType (mimeType: string) {
        return supportedMimeTypes.indexOf(mimeType) >= 0;
    }
}