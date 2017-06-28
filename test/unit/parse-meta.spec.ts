import parseMeta from '../../src/parse-meta';

describe('ODF', () => {
    describe('parseMeta()', () => {
        it('should parse ODF meta.xml content', () => {
            const fileContent: string = `
                <?xml version="1.0" encoding="UTF-8"?>
                <office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
                                      xmlns:xlink="http://www.w3.org/1999/xlink" 
                                      xmlns:dc="http://purl.org/dc/elements/1.1/"
                                      xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0"
                                      xmlns:ooo="http://openoffice.org/2004/office" 
                                      xmlns:grddl="http://www.w3.org/2003/g/data-view#"
                                      office:version="1.2"
                                      grddl:transformation="http://docs.oasis-open.org/office/1.2/xslt/odf2rdf.xsl">
                    <office:meta>
                        <meta:generator>LibreOffice/3.3$Linux LibreOffice_project/330m17$Build-3</meta:generator>
                        <dc:title>Open Source, Open Standards, OpenDocument</dc:title>
                        <meta:initial-creator>Jean Hollis Weber</meta:initial-creator>
                        <meta:creation-date>2008-06-05T09:52:11</meta:creation-date>
                        <dc:creator>Jean Hollis Weber</dc:creator>
                        <dc:date>2011-01-03T06:34:57</dc:date>
                        <meta:editing-cycles>106</meta:editing-cycles>
                        <meta:editing-duration>PT13H32M46S</meta:editing-duration>
                        <meta:document-statistic meta:table-count="5" meta:image-count="1" meta:object-count="0"
                                                 meta:page-count="10"
                                                 meta:paragraph-count="194" meta:word-count="2684" 
                                                 meta:character-count="17379"/>
                        <meta:user-defined meta:name="Info 1"/>
                        <meta:user-defined meta:name="Info 2"/>
                        <meta:user-defined meta:name="Info 3"/>
                        <meta:user-defined meta:name="Info 4"/>
                        <meta:template xlink:type="simple" xlink:actuate="onRequest" 
                                       xlink:title="LibO3_3_chapter_template"
                   xlink:href="../../../../../AppData/Roaming/LibreOffice/3/user/template/LibO3_3_chapter_template.ott"
                                       meta:date="2010-12-29T20:41:35.13"/>
                    </office:meta>
                </office:document-meta>
            `;
            const fileMetaInformation: {[key: string]: any;} = {};

            parseMeta(fileContent, fileMetaInformation as any);

            expect(fileMetaInformation).toEqual({
                creator: 'Jean Hollis Weber',
                createdAt: '2008-06-05T09:52:11',
                modifiedAt: '2011-01-03T06:34:57'
            });
        });
    });
});