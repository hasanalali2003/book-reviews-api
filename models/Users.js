const mongoose = require("mongoose");
const { Book, reviewsSchema } = require("./Books");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    favourites: [
        {
            book: {
                type: Schema.Types.ObjectId,
                ref: "Book", // Reference to the Book model
            },
            title: String,
            author: String,
            ISBN: String,
            pages: Number,
            genres: [String],
            reviews: [reviewsSchema],
        },
    ],
});

userSchema.index({ username: "text" });
const User = mongoose.model("User", userSchema);

module.exports = User;
