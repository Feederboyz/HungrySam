import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import express from 'express';
import db from '../scripts/db.js'
const router = express.Router();

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await db.query('SELECT cover FROM posts WHERE id=$1', [id]);
    const cover = result.rows[0].cover;
    res.writeHead(200, {
      'Content-Type': 'image/jpg' 
    });
    res.end(cover); 
});

export default router;