const express = require("express");
const bcrypt = require("bcrypt");
const isValid = require("./auth_users.js").isValid;
const User = require("../models/Users.js");
const { Book } = require("../models/Books.js");

const public_users = express.Router();

const doesExist = async (username, email) => {
    const user = await User.findOne({ username: username });
    const mail = await User.findOne({ email: email });
    return !!user || !!mail;
};

public_users.post("/register", async (req, res) => {
    const { username, email } = req.body;
    let password = req.body.password;

    if (username && password) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        if (await doesExist(username, email)) {
            res.status(404).json({
                message: "This user is already exists!",
            });
        } else {
            if (isValid(username)) {
                const newUser = {
                    username,
                    email,
                    password,
                    favorites: [],
                };
                await User.create(newUser);
                res.status(201).json({
                    message: "User successfully registered!",
                });
            } else {
                res.status(404).json({ message: "The username is not valid!" });
            }
        }
    } else {
        res.status(404).json({
            message: "Please check username and password!",
        });
    }
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
    try {
        const allBooks = await Book.find();
        res.status(201).json(allBooks);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = await Book.findOne({ ISBN: isbn });
        if (book) res.status(201).json(book);
        else
            res.status(404).json({
                message: "There is no book with this ISBN!",
            });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
    try {
        const author = req.params.author;
        const books = await Book.find({ author: author });
        if (books.length > 0) res.status(201).json(books);
        else
            res.status(404).json({
                message: "There is no books for this author!",
            });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
    try {
        const title = req.params.title;
        const books = await Book.find({ title: title });
        if (books.length > 0) res.status(201).json(books);
        else
            res.status(404).json({
                message: "There is no books with this title!",
            });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

public_users.get("/genre", async (req, res) => {
    try {
        const genres = req.query.genres ? req.query.genres.split("+") : [];
        const books = await Book.find({ genres: { $in: genres } });

        if (books.length > 0) res.status(201).json(books);
        else
            res.status(404).json({
                message: "There is no books with this genres!",
            });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//  Get book review
public_users.get("/review/:isbn", async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = await Book.findOne({ ISBN: isbn });
        const bookReviews = book.reviews;
        if (bookReviews.length > 0) res.status(201).json(bookReviews);
        else
            res.status(404).json({
                message: "There is no reviews for this book!",
            });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports.general = public_users;
