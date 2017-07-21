import { Relations } from '../index';
export interface DocumentContentParsingOptions {
    relations: Relations;
}
export default function parseDocumentContent(fileContent: string, options: DocumentContentParsingOptions): {
    styles: string;
    content: string;
};
