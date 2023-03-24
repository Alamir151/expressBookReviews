const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  if (users[username]) {
    return Promise.reject({ status: 400, message: 'User already exists' });
  }

  // Add the new user to the users object
  users[username] = { username, password };

  // Return a success message
  return Promise.resolve({ message: 'User registration successful' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return Promise.resolve(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Find the book with the specified ISBN
  const book = books.find((b) => b.isbn === req.params.isbn);

  // Return an error if the book is not found
  if (!book) {
    return Promise.reject({ status: 404, message: 'Book not found' });
  }

  // Return the book details
  return Promise.resolve(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Find all books by the specified author
  const booksByAuthor = books.filter((b) => b.author === req.params.author);

  // Return an error if no books are found
  if (booksByAuthor.length === 0) {
    return Promise.reject({ status: 404, message: 'Books not found' });
  }

  // Return the list of books
  return Promise.resolve(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = books.find((book) => book.title === req.params.title);
  if (!title) {
    return Promise.reject({ status: 404, message: 'Books not found' });
  }
  return Promise.resolve(title);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Find the book with the specified ISBN
  const book = books.find((b) => b.isbn === req.params.isbn);

  // Return an error if the book is not found
  if (!book) {
    return Promise.reject({ status: 404, message: 'Book not found' });
  }

  // Return the book review
  return Promise.resolve(book.review);
});

module.exports.general = public_users;
