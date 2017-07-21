import {Archive, ArchiveEntry} from 'file2html-archive-tools';
import {lookup} from 'file2html/lib/mime';
import {Relations} from './index';

export default function parsePictures (picturesFolder: Archive): Promise<Relations> {
    const relations: Relations = {};

    if (!picturesFolder) {
        return Promise.resolve(relations);
    }

    const queue: Promise<void>[] = [];

    picturesFolder.forEach((relativePath: string, fileEntry: ArchiveEntry) => {
        queue.push(fileEntry.async('base64').then((base64: string) => {
            relations[relativePath] = `data:${ lookup(relativePath) };base64,${ base64 }`;
        }));
    });

    return Promise.all(queue).then(() => relations);
}