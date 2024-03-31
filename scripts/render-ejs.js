'use strict';
import fs from 'fs';
import ejs from 'ejs';
import prettier from 'prettier';

function renderEjs(filePath, data = {}) {
    const opts = {};
    ejs.renderFile(filePath, data, opts, async function (err, str) {
        if (err) {
            console.error(err);
            return;
        } else {
            const prettified = await prettier.format(str, {
                printWidth: 1000,
                tabWidth: 4,
                singleQuote: true,
                proseWrap: 'preserve',
                endOfLine: 'lf',
                parser: 'html',
                htmlWhitespaceSensitivity: 'ignore'
            });

            const destPath = filePath.replace(/src\/ejs\//, 'dist/').replace(/\.ejs$/, '.html');
            fs.writeFile(destPath, prettified, function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        }
    });
}
export default renderEjs;