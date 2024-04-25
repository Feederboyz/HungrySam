import express from "express";
import db from "../scripts/services/db.js";
const router = express.Router();

router.get("/location/:postId", async (req, res) => {
    const postId = req.params.postId;
    const result = await db.query("SELECT * FROM posts WHERE id=$1", [postId]);
    res.send(result.rows[0].location);
});

export default router;
