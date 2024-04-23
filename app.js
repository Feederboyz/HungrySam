import express from "express";
import session from "express-session";
import upath from "upath";
import { fileURLToPath } from "url";
import aboutRouter from "./routes/about.js";
import postsRouter from "./routes/posts.js";
import indexRouter from "./routes/index.js";
import coverRouter from "./routes/cover.js";
import authRouter from "./routes/auth.js";
import loginRouter from "./routes/login.js";
import passport from "./scripts/passport.js";

const app = express();

const __dirname = upath.dirname(fileURLToPath(import.meta.url));
const distPath = upath.join(__dirname, "./dist");
const viewsPath = upath.join(__dirname, "./ejs");

app.use(express.static(distPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.user = req.user;
    next();
});

app.set("views", viewsPath);
app.use("/", indexRouter);
app.use("/about", aboutRouter);
app.use("/posts", postsRouter);
app.use("/cover", coverRouter);
app.use("/auth", authRouter);
app.use("/login", loginRouter);

export default app;
