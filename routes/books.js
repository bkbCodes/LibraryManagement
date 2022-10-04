const express = require("express");

const { users } = require("../data/users.json");
const { books } = require("../data/books.json");
const { getAllBooks, getSingleBookById, createNewBook, getAllIssuedBooks, updateBookById, getAllIssuedBooksWithFine } = require("../controllers/book-controller");

const router = express.Router();

/**
 * Route: /books
 * Method: GET
 * Description: Get all books
 * Access: Public
 * Parameters: none
 */
 router.get("/", getAllBooks);

/**
 * Route: /books
 * Method: POST
 * Description: Create new book
 * Access: Public
 * Parameters: none
 */
 router.post("/", createNewBook);

/**
 * Route: /books/:id
 * Method: GET
 * Description: Get single book by id
 * Access: Public
 * Parameters: id
 */
 router.get("/:id", getSingleBookById);

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update book by id
 * Access: Public
 * Parameters: id
 */
 router.put("/:id", updateBookById);

/**
 * Route: /books/issued/by-user
 * Method: GET
 * Description: Get all issued books
 * Access: Public
 * Parameters: id
 */
 router.get("/issued/by-user", getAllIssuedBooks);

/**
 * Route: /books/issued/withFine
 * Method: GET
 * Description: Get all issued books with fine
 * Access: Public
 * Parameters: id
 */
 router.get("/issued/withFine", getAllIssuedBooksWithFine);

module.exports = router;