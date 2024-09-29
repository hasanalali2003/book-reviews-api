const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    if (username.length > 1) return true;
    else return false;
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

    if (isValid(username) && authenticatedUser(username, password)) {
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
    const text = req.query.text;
    const isbn = req.params.isbn;
    const loggedUser = req.session.authorization.username;

    const book = Object.values(books).find((book) => book.isbn === isbn);
    if (book) {
        if (!text) res.status(404).json({ message: "Please write a review" });

        const review = Object.values(book.reviews).find(
            (item) => item.user === loggedUser
        );

        if (review) {
            review.text = text;
            res.status(300).json({ message: "review modifed" });
        } else {
            book.reviews = [...book.reviews, { user: loggedUser, text: text }];
            res.status(300).json({ message: "review added" });
        }
    } else {
        res.status(404).json({ message: "There is no Book with this ISBN" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const loggedUser = req.session.authorization.username;
    const book = Object.values(books).find((book) => book.isbn === isbn);
    if (book) {
        book.reviews = Object.values(book.reviews).filter(
            (item) => item.user != loggedUser
        );
        res.status(300).json({ message: "review deleted" });
    } else {
        res.status(404).json({ message: "There is no Book with this ISBN" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
