'use strict';
import upath from 'upath';
import sh from 'shelljs';
import { fileURLToPath } from 'url';

const __dirname = upath.dirname(fileURLToPath(import.meta.url));
const scssPath = upath.resolve(__dirname, '../scss/custom.scss');
const distPath = upath.resolve(__dirname, '../dist/css/index.css');
const command = `npx sass ${scssPath} ${distPath}`
sh.exec(command, (code, stdout, stderr) => {
  if(stdout){
    console.log('Program output:', stdout);
  }
  if(stderr){
    console.log('Program stderr:', stderr);
  }
});

