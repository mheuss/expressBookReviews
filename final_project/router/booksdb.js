const express = require("express");
let books = {
  1: {
    author: "Chinua Achebe",
    title: "Things Fall Apart",
    reviews: {},
  },
  2: { author: "Hans Christian Andersen", title: "Fairy tales", reviews: {} },
  3: { author: "Dante Alighieri", title: "The Divine Comedy", reviews: {} },
  4: { author: "Unknown", title: "The Epic Of Gilgamesh", reviews: {} },
  5: { author: "Unknown", title: "The Book Of Job", reviews: {} },
  6: { author: "Unknown", title: "One Thousand and One Nights", reviews: {} },
  7: { author: "Unknown", title: "Nj\u00e1l's Saga", reviews: {} },
  8: { author: "Jane Austen", title: "Pride and Prejudice", reviews: {} },
  9: {
    author: "Honor\u00e9 de Balzac",
    title: "Le P\u00e8re Goriot",
    reviews: {},
  },
  10: {
    author: "Samuel Beckett",
    title: "Molloy, Malone Dies, The Unnamable, the trilogy",
    reviews: {},
  },
};

const books_routes = express.Router();

books_routes.get("/", (req, res) => {
  // Update the code here
  res.json(books);
});

books_routes.get("/isbn/:isbn", (req, res) => {
  // Get param
  const isbn = req.params.isbn;
  // Check if the book exists
  if (books[isbn]) {
    res.json(books[isbn]);
  } else {
    // Bail, baby!
    res.status(404).send("Book not found");
  }
});

module.exports = books_routes;
