"use strict";
import fs from "fs";
import upath from "upath";
import sh from "shelljs";
import { fileURLToPath } from "url";
import { promisify } from "util";

const __dirname = upath.dirname(fileURLToPath(import.meta.url));
const srcPath = upath.resolve(__dirname, "../component/");
const distPath = upath.resolve(__dirname, "../../dist/js");
const command = `cp ${srcPath}/* ${distPath}`;

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function copyFiles(src, dest) {
    try {
        const files = await readdir(src);
        for (const file of files) {
            const srcFile = upath.join(src, file);
            const destFile = upath.join(dest, file);
            await copyFile(srcFile, destFile);
        }
        console.log("Files copied successfully!");
    } catch (error) {
        console.error("Error copying files:", error);
    }
}

copyFiles(srcPath, distPath);
