import * as file2html from 'file2html';
export default class ODFReader extends file2html.Reader {
    read({fileInfo}: file2html.ReaderParams): Promise<any>;
    static testFileMimeType(mimeType: string): boolean;
}
