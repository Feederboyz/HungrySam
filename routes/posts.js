import upath from "upath";
import { fileURLToPath } from 'url';
import express from 'express';
import db from '../scripts/db.js'
const router = express.Router();


async function queryPosts(postId){
    const result = await db.query('select content, title from posts where id=$1', [postId]);
    const content = result.rows[0].content;
    const title = result.rows[0].title;
    return {content, title};
}

async function queryReplies(postId){
    const result = await db.query('select content, userid from replies where postid=$1', [postId]);
    return result.rows;
}
async function queryUsersInfo(){
    const result = await db.query('select * from users');
    const usersInfo = result.rows.reduce((acc, {googleid, ...rest}) => {
        acc[googleid] = rest;
        return acc;
    }, {});
    return usersInfo;
}

router.get("/", async (req, res) => {
    const result = await db.query('SELECT * FROM posts');
    const posts = result.rows.map(({id, title, content})=>({id, title, content}));
    let scripts = ['https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js', '/js/posts.js'];
    res.render("posts.ejs",{posts: posts, activePage: 'posts', scripts: scripts});
});

router.get("/:postId(\\d+)", async (req, res) => {
    const postId = req.params.postId;
    const post = await queryPosts(postId);
    const replies = await queryReplies(postId);
    const usersInfo = await queryUsersInfo();
    res.render("post.ejs", { post: post, replies: replies, usersInfo: usersInfo, activePage: 'posts'});
});

export default router;