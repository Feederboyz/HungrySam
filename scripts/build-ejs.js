'use strict';
import upath from 'upath';
import sh from 'shelljs';
import renderEjs from './render-ejs.js';
import { fileURLToPath } from 'url';

const srcPath = upath.resolve(upath.dirname(fileURLToPath(import.meta.url)), '../src/ejs');

sh.find(srcPath).forEach(_processFile);

function _processFile(filePath) {
    if (
        filePath.match(/\.ejs$/)
        && !filePath.match(/partials/)
    ) {
        renderEjs(filePath);
    }
}