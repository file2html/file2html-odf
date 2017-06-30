import * as fs from 'fs';
import * as path from 'path';
import parseStyles from '../../../src/styles/parse-styles';

const validateCss = require('css-validator');

describe('ODF', () => {
    describe('parseStyles()', () => {
        it('should parse ODF styles.xml file', (done) => {
            const css: string = parseStyles(fs.readFileSync(path.resolve(__dirname, '../../styles.xml')).toString());

            expect(css.length).toBeGreaterThan(0);

            validateCss(css, (error: Error, data: any) => {
                if (error) {
                    return done(error);
                }

                expect(data.errors).toEqual([]);
                expect(data.validity).toBeTruthy();
                done();
            });
        });
    });
});