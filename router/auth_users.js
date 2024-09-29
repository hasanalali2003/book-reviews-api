const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
    let validUsers = users.filter(
        (user) => user.username === username && user.password === password
    );
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!password || !username) {
        res.status(404).json({ message: "You missing username or password!" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            "access",
            {
                expiresIn: 60 * 60,
            }
        );

        req.session.authorization = { accessToken, username };
        res.status(300).json({ message: "User successfully logged in!" });
    } else {
        res.status(403).json({ message: "Please check login information" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
