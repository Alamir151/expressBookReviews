const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // This function checks if the given username is valid
  // and returns a boolean value indicating whether it is valid or not
  // Here you can add your validation logic for the username format or any other criteria
  // For now, let's assume that any non-empty string is a valid username
  return !!username;
}

const authenticatedUser = (username, password) => {
  
  
  return users.some(user => user.username === username && user.password === password);
}

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ username }, "secret_key");
  res.json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { rating, review } = req.body;
  const book = books.find(book => book.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  book.reviews.push({ rating, review });
  res.json({ book });
});
// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.body;

  // Check if the user is authenticated

  // Find the book in the database
  const book = books.find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Find the user's review for this book
  const reviewIndex = book.reviews.findIndex(review => review.username === username);

  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Remove the review
  book.reviews.splice(reviewIndex, 1);

  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
