import express from "express";
import passport from "../scripts/services/passport.js";
const router = express.Router();

router.get("/google", passport.authenticate("google"));

router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
        if (err) {
            return next(err);
        }
        // if authentication fails, redirect to the login page
        if (!user) {
            return res.render("login.ejs", {
                activePage: "login",
                scripts: ["/js/login.js"],
                error: "authFail",
            });
        }
        // if authentication succeeds, redirect to the home page
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect("/");
        });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }
        res.redirect("/");
    });
});

export default router;
