const { text } = require("express");

let books = {
    1: {
        author: "Chinua Achebe",
        title: "Things Fall Apart",
        isbn: "11",
        reviews: {},
    },
    2: {
        author: "Hans Christian Andersen",
        title: "Fairy tales",
        isbn: "22",
        reviews: {},
    },
    3: {
        author: "Dante Alighieri",
        title: "The Divine Comedy",
        isbn: "33",
        reviews: {
            title: "this is review title test",
            text: "this is review text test",
        },
    },
    4: {
        author: "Unknown",
        title: "The Epic Of Gilgamesh",
        isbn: "44",
        reviews: {},
    },
    5: { author: "Unknown", title: "The Book Of Job", isbn: "55", reviews: {} },
    6: {
        author: "Unknown",
        title: "One Thousand and One Nights",
        isbn: "66",
        reviews: {},
    },
    7: {
        author: "Unknown",
        title: "Nj\u00e1l's Saga",
        isbn: "77",
        reviews: {},
    },
    8: {
        author: "Jane Austen",
        title: "Pride and Prejudice",
        isbn: "88",
        reviews: {},
    },
    9: {
        author: "Honor\u00e9 de Balzac",
        title: "Le P\u00e8re Goriot",
        isbn: "99",
        reviews: {},
    },
    10: {
        author: "Samuel Beckett",
        title: "Molloy, Malone Dies, The Unnamable, the trilogy",
        isbn: "111",
        reviews: {},
    },
};

module.exports = books;
