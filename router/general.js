const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let usersWithSameName = users.filter((user) => {
        return user.username === username;
    });
    if (usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
};

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (doesExist(username)) {
            res.status(404).json({ message: "The username is already exists" });
        } else {
            users.push({
                username: username,
                password: password,
            });
            res.status(300).json({ message: "User successfully registered" });
        }
    } else {
        res.status(404).json({ message: "Please check username and password" });
    }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    return res.status(300).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books).find((book) => book.isbn === isbn);
    return res.status(300).json(JSON.stringify(book));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = Object.values(books).filter(
        (book) => book.author === author
    );
    const booksByAuthor = Object.values(getBooksByAuthor);

    res.status(300).json(JSON.stringify(booksByAuthor));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = Object.values(books).filter(
        (book) => book.title === title
    );
    const booksByTitle = Object.values(getBooksByTitle);

    res.status(300).json(JSON.stringify(booksByTitle));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const book = Object.values(books).find((book) => book.isbn === isbn);
    const bookReviews = book.reviews;
    res.status(300).json(JSON.stringify(bookReviews));
});

module.exports.general = public_users;
