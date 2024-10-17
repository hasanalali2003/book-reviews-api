const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const user_routes = require("./router/auth_users").authenticated;
const genl_routes = require("./router/general").general;
const db = require("./config/db");

const app = express();

app.use(express.json());

app.use(
    "/user",
    session({
        secret: "fingerprint_user",
        resave: true,
        saveUninitialized: true,
    })
);

app.use("/user/auth", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization["accessToken"];

        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res
                    .status(403)
                    .json({ message: "User not authencatied!" });
            }
        });
    } else {
        return res.status(403).json({ message: "Please login first!" });
    }
});

const port = 3000;

app.use("/user", user_routes);
app.use("/", genl_routes);
db.connect();

app.listen(port, () => {
    console.log("Listening to port : ", port);
});
