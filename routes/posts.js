import upath from "upath";
import { fileURLToPath } from 'url';
import express from 'express';
import db from '../scripts/db.js'
const router = express.Router();


router.get("/", async (req, res) => {
    const result = await db.query('SELECT * FROM posts');
    const posts = result.rows.map(({id, title, content})=>({id, title, content}));
    let scripts = ['https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js', '/js/posts.js'];
    res.render("posts.ejs",{posts: posts, activePage: 'posts', scripts: scripts});
});

router.get("/:id(\\d+)", async (req, res) => {
    const id = req.params.id;
    const result = await db.query('SELECT content, title FROM posts WHERE id=$1', [id]);
    const content = result.rows[0].content;
    const title = result.rows[0].title;
    res.render("post.ejs", { title: title, content: content, activePage: 'posts'});
});

export default router;