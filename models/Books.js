const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    review: String,
});

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    ISBN: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    genres: [String],
    reviews: [reviewsSchema],
});
bookSchema.index({ title: "text" });
const Book = mongoose.model("Book", bookSchema);

module.exports = { Book, reviewsSchema };
