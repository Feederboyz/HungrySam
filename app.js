import express from "express";
import upath from "upath";
import { fileURLToPath } from 'url';
import aboutRouter from './routes/about.js';
import postsRouter from './routes/posts.js';
import indexRouter from './routes/index.js';

const app = express();

const __dirname = upath.dirname(fileURLToPath(import.meta.url));
const distPath = upath.join(__dirname, './dist');
const viewsPath = upath.join(__dirname, './src/ejs');

app.use(express.static(distPath));
app.set("views", viewsPath);

app.use('/', indexRouter);
app.use('/', aboutRouter);
app.use('/', postsRouter);

export default app;