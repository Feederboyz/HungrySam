'use strict';
import fs from 'fs';
import ejs from 'ejs';
// const prettier = require('prettier');

export default function renderEjs(filePath) {
    const data = {};
    const opts = {};
    ejs.renderFile(filePath, data, opts, function (err, str) {
        if (err) {
            console.error(err);
            return;
        } else {
            const destPath = filePath.replace(/src\/ejs\//, 'dist/').replace(/\.ejs$/, '.html');
            fs.writeFile(destPath, str, function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        }
    });

};