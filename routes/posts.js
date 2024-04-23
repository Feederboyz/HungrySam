import express from "express";
import db from "../scripts/db.js";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "dist/uploads/images");
    },
    filename: function (req, file, cb) {
        // Add suffix to avodid file name conflict
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

async function queryPosts(postId) {
    const result = await db.query(
        "SELECT id, thumbnail_url, content, title FROM posts WHERE id=$1",
        [postId]
    );
    return result.rows[0];
}

async function queryComments(postId) {
    const result = await db.query(
        "SELECT id, content, user_id FROM comments WHERE post_id=$1",
        [postId]
    );
    return result.rows;
}
async function queryUsersInfo() {
    const result = await db.query("SELECT id, username, avatar_url FROM users");
    const usersInfo = result.rows.reduce((acc, { id, ...rest }) => {
        acc[id] = rest;
        return acc;
    }, {});
    return usersInfo;
}

router.get("/", async (req, res) => {
    const result = await db.query(
        "SELECT id, title, content, thumbnail_url FROM posts"
    );
    const posts = result.rows;
    const scripts = [
        "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js",
        "/js/posts.js",
    ];
    res.render("posts.ejs", {
        posts: posts,
        activePage: "posts",
        scripts: scripts,
    });
});

router.get("/add_post", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("addPost.ejs", {
            activePage: "addPost",
            scripts: ["/js/addPost.js"],
        });
    } else {
        res.redirect("/login?error=noLogin");
    }
});

router.post(
    "/add_post",
    upload.single("thumbnail"), // save id=thumbnail file with multer
    async (req, res) => {
        if (req.isAuthenticated()) {
            try {
                const title = req.body.title;
                // replace new line with <br> tag
                const content = req.body.content.replace(/\n/g, "<br/>");
                const host = req.get("host");
                const currentUrl = `${req.protocol}://${host}/`;
                const thumbnailUrl = req.file
                    ? currentUrl + `uploads/images/${req.file.filename}`
                    : null;

                const query =
                    "INSERT INTO posts (title, content, thumbnail_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *";
                const values = [title, content, thumbnailUrl, req.user.id];
                const result = await db.query(query, values);

                res.redirect("/posts");
            } catch (error) {
                console.error("Error creating post:", error);
                res.status(500).send("Server error");
            }
        } else {
            res.redirect("/login?error=noLogin");
        }
    }
);

router.get("/:postId(\\d+)", async (req, res) => {
    const postId = req.params.postId;
    const post = await queryPosts(postId);
    const comments = await queryComments(postId);
    const usersInfo = await queryUsersInfo();
    const scripts = [
        "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js",
        "/js/post.js",
    ];
    res.render("post.ejs", {
        post: post,
        comments: comments,
        usersInfo: usersInfo,
        activePage: "posts",
        scripts: scripts,
    });
});

router.post("/:postId(\\d+)/comments", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            // create new comment
            const { content } = req.body;
            const query =
                "INSERT INTO comments (content, user_id, post_id) VALUES ($1, $2, $3)";
            const values = [content, req.user.id, req.params.postId];
            await db.query(query, values);
            res.redirect(`/posts/${req.params.postId}`);
        } catch (error) {
            console.error("Error when creating comment:", error);
            res.status(500).send("Server error");
        }
    } else {
        res.redirect("/login?error=noLogin");
    }
});
router.post("/:postId(\\d+)/comments/:commentId(\\d+)", async (req, res) => {
    if (req.isAuthenticated()) {
        const commentId = req.params.commentId;
        if (commentId === undefined) {
            // create new comment
            try {
                // insert comment into comments table
                const { content } = req.body;
                const query =
                    "INSERT INTO comments (content, user_id, post_id) VALUES ($1, $2, $3)";
                const values = [content, req.user.id, req.params.postId];
                await db.query(query, values);
                res.redirect(`/posts/${req.params.postId}`);
            } catch (error) {
                console.error("Error when creating comment:", error);
                res.status(500).send("Server error");
            }
        } else {
            // update comment
            try {
                const { content } = req.body;
                const query = "UPDATE comments SET content=$1 WHERE id=$2";
                const values = [content, commentId];
                await db.query(query, values);
                res.redirect(`/posts/${req.params.postId}`);
            } catch (error) {
                console.error("Error when updating comment:", error);
                res.status(500).send("Server error");
            }
        }
    } else {
        res.redirect("/login?error=noLogin");
    }
});

router.delete("/comments", async (req, res) => {
    const commentId = req.body.commentId;
    try {
        const query = "DELETE FROM comments WHERE id=$1";
        const values = [commentId];
        await db.query(query, values);
        res.status(200).send("OK");
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).send("Server error");
    }
});

export default router;
