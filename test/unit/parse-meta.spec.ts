import * as fs from 'fs';
import * as path from 'path';
import parseMeta from '../../src/parse-meta';

describe('ODF', () => {
    describe('parseMeta()', () => {
        it('should parse ODF meta.xml content', () => {
            const fileContent: string = fs.readFileSync(path.resolve(__dirname, '../meta.xml')).toString();
            const fileMetaInformation: {[key: string]: any} = {};

            parseMeta(fileContent, fileMetaInformation as any);

            expect(fileMetaInformation).toEqual({
                creator: 'Jean Hollis Weber',
                createdAt: '2008-06-05T09:52:11',
                modifiedAt: '2011-01-03T06:34:57'
            });
        });
    });
});