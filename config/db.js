const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/BooksReviews";
const connect = () => {
    mongoose
        .connect(url)
        .then(() => {
            console.log("Connected Successfuly to MongoDB");
        })
        .catch((err) => {
            console.log("An error occurred! details:");
            console.log(err);
        });
};

module.exports = { connect };
