const express = require("express");
const jwt = require("jsonwebtoken");
let { books } = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 },
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Delete a book review for a given user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // Get the id from the authenticated user
  const username = req.session.authorization.username;

  // Check if the book exists
  if (!books[isbn]) {
    res.status(404).send("Book not found");
    return;
  }

  if (!books[isbn].reviews[username]) {
    res.status(404).send("Review not found");
    return;
  }

  // Let's delete the review
  delete books[isbn].reviews[username];
  return res.status(200).json({
    message: `Review for isbn ${isbn} posted by user ${username} has been deleted`,
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Get the review from the query param
  const review = req.query.review;

  // Get the id from the authenticated user
  const username = req.session.authorization.username;

  // Check if the book exists
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    res.status(404).send("Book not found");
    return;
  }

  // Let's update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
