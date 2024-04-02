import pg from 'pg';
import dotenv from 'dotenv';
import express from 'express';
const router = express.Router();

dotenv.config();

const db = new pg.Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: 5432,
    ssl: true
});
await db.connect()

router.get("/posts", async (req, res) => {
    const result = await db.query('SELECT * FROM posts');
    const posts = result.rows.map(({id, title, content})=>({id, title, content}));
    res.render("posts.ejs",{posts: posts});
});

router.get("/posts/:id(\\d+)", async (req, res) => {
    const id = req.params.id;
    const result = await db.query('SELECT * FROM posts WHERE id=$1', [id]);
    const content = result.rows[0].content;
    const title = result.rows[0].title;
    res.render("post.ejs", { title: title, content: content });
});

export default router;