import GoogleStrategy from "passport-google-oauth2";
import passport from "passport";
import db from "./db.js";

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env["GOOGLE_CLIENT_ID"],
            clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
            callbackURL: process.env["GOOGLE_CB_URL"],
            scope: ["profile"],
            state: true,
        },
        function verify(accessToken, refreshToken, profile, cb) {
            const query = {
                text: "SELECT * FROM users WHERE auth_method = 'google' AND auth_data = $1",
                values: [profile.id],
            };
            db.query(query, (err, res) => {
                if (err) {
                    console.log(err.stack);
                    return cb(err, null);
                } else {
                    if (res.rows.length === 0) {
                        // create a new user
                        const query = {
                            text: "INSERT INTO users(auth_data, username, email, auth_method, avatar_url) VALUES($1, $2, $3, $4, $5)",
                            values: [
                                profile.id,
                                profile.displayName,
                                profile.email,
                                profile.provider,
                                profile.picture,
                            ],
                        };
                        db.query(query, (err, res) => {
                            if (err) {
                                console.log(err.stack);
                                return cb(err, null);
                            } else {
                                return cb(null, profile);
                            }
                        });
                    } else {
                        // update the user's information
                        const id = res.rows[0].id;
                        const query = {
                            text: "UPDATE users SET username = $2, email = $3, auth_method = $4, avatar_url = $5 WHERE auth_data = $1",
                            values: [
                                profile.id,
                                profile.displayName,
                                profile.email,
                                profile.provider,
                                profile.picture,
                            ],
                        };
                        db.query(query, (err, res) => {
                            if (err) {
                                console.log(err.stack);
                                return cb(err, null);
                            } else {
                                return cb(null, profile);
                            }
                        });
                    }
                }
            });
        }
    )
);

passport.serializeUser((user, cb) => {
    cb(null, {
        authMethod: user.provider,
        authData: user.id,
    });
});

passport.deserializeUser((user, cb) => {
    if (user.authMethod === "google") {
        db.query(
            "SELECT * FROM users WHERE auth_method = 'google' AND auth_data = $1",
            [user.authData],
            (err, res) => {
                if (err) {
                    console.log(err.stack);
                    return cb(err, null);
                } else {
                    return cb(null, res.rows[0]);
                }
            }
        );
    }
});

export default passport;
