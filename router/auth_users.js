const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const regd_users = express.Router();
const User = require("../models/Users.js");
const { Book } = require("../models/Books.js");

const containsSpecialChars = (str) => {
    const specialChars = "[` !@#$%^&*()+=[]{};':\"\\|,<>/?~]/";
    return specialChars.split("").some((char) => str.includes(char));
};

const isValid = (username) => {
    if (username.length > 3 && !containsSpecialChars(username)) return true;
    else return false;
};

const authenticatedUser = async (username, password) => {
    const user = await User.findOne({ username: username });

    if (!user) return false;

    const isMatch = await bcrypt.compare(password, user.password);

    return isMatch;
};

//only registered users can login
regd_users.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!password || !username) {
        res.status(404).json({
            message: "You are missing username or password!",
        });
    }

    if (isValid(username) && (await authenticatedUser(username, password))) {
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
regd_users.put("/auth/review/:isbn", async (req, res) => {
    const text = req.body.text;
    const isbn = req.params.isbn;
    const loggedUser = req.session.authorization.username;

    //Fetch the book and its reviews in a single query
    const book = await Book.findOne({ ISBN: isbn });
    if (book) {
        const existingReview = book.reviews.find(
            (review) => review.username === loggedUser
        );

        if (!text)
            return res.status(404).json({ message: "Please write a review" });

        if (existingReview) {
            // Update existing review
            existingReview.review = text;
            await book.save();
            return res.status(201).json({ message: "Review modified." });
        } else {
            // Add new review
            book.reviews.push({ username: loggedUser, review: text });
            await book.save();
            return res.status(201).json({ message: "Review added." });
        }
    } else {
        res.status(404).json({
            message: "There is no Book with this ISBN",
        });
    }
});

regd_users.delete("/auth/review/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const loggedUser = req.session.authorization.username;
    const book = await Book.findOne({ ISBN: isbn });

    if (book) {
        const reviewsBefore = book.reviews.length;

        book.reviews = book.reviews.filter(
            (review) => review.username != loggedUser
        );

        if (reviewsBefore === book.reviews.length) {
            return res
                .status(404)
                .json({ message: "No review found for this user!" });
        }

        await book.save();
        return res.status(201).json({ message: "Review Deleted" });
    } else {
        return res
            .status(404)
            .json({ message: "There is no Book with this ISBN" });
    }
});

regd_users.put("/auth/favourite/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const loggedUser = req.session.authorization.username;

    const book = await Book.findOne({ ISBN: isbn });
    if (book) {
        const user = await User.findOne({ username: loggedUser });
        // Limit Favourites to 30 Books
        if (user.favourites.length < 30) {
            const existingFavourite = user.favourites.find(
                (fav) => fav.book._id.toString() === book._id.toString()
            );

            if (existingFavourite) {
                return res
                    .status(404)
                    .json({ message: "Book Already in Favourites." });
            } else {
                user.favourites.push({
                    book: book._id, // Reference to the book ID
                    title: book.title,
                    author: book.author,
                    ISBN: book.ISBN,
                    pages: book.pages,
                    reviews: book.reviews,
                });
                console.log(user.favourites);
                await user.save();
                return res
                    .status(201)
                    .json({ message: "Book Added to Favourites." });
            }
        } else {
            return res.status(404).json({
                message: "Cannot add more than 30 books to favourites!",
            });
        }
    } else {
        res.status(404).json({
            message: "There is no Book with this ISBN",
        });
    }
});

regd_users.delete("/auth/favourite/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const loggedUser = req.session.authorization.username;

    const book = await Book.findOne({ ISBN: isbn });

    if (book) {
        const user = await User.findOne({ username: loggedUser });
        const favouritesBefore = user.favourites.length;

        user.favourites = user.favourites.filter(
            (fav) => fav.book._id.toString() != book._id.toString()
        );

        if (favouritesBefore === user.favourites.length) {
            return res
                .status(404)
                .json({ message: "This book is not in favourites!" });
        }

        await user.save();
        return res
            .status(201)
            .json({ message: "Book Deleted from favourites!" });
    } else {
        res.status(404).json({
            message: "There is no Book with this ISBN",
        });
    }
});

regd_users.get("/auth/favourite", async (req, res) => {
    const loggedUser = req.session.authorization.username;
    const user = await User.findOne({ username: loggedUser });

    if (user.favourites.length > 0) {
        return res.status(201).json(user.favourites);
    } else {
        return res
            .status(404)
            .json({ message: "There is no Favourites Books." });
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
