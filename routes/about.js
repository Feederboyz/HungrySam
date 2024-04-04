import express from 'express';
const router = express.Router();

router.get("/", (req, res) => {
    res.render("about.ejs", {activePage: 'about'});
});

export default router;