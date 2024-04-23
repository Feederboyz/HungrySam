import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    const error = req.query.error;

    var modalMessage = undefined;
    if (error === "authFail") {
        modalMessage = "Authentication error. Please try again.";
    } else if (error === "noLogin") {
        modalMessage = "Please login first.";
    }
    res.render("login.ejs", {
        activePage: "login",
        scripts: ["/js/login.js"],
        modalMessage: modalMessage,
    });
});

export default router;
