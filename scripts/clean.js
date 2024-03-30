import sh from 'shelljs';
import upath from 'upath';
import { fileURLToPath } from 'url';

const destPath = upath.resolve(fileURLToPath(import.meta.url), '../dist');

sh.rm('-rf', `${destPath}/*`)