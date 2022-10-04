const express = require("express");

const {users} = require("../data/users.json");
const {books} = require("../data/books.json");

const router = express.Router();

/**
 * Route: /books
 * Method: GET
 * Description: Get all books
 * Access: Public
 * Parameters: none
 */
 app.get("/", (req,res) =>{
    res.status(200).json({
        success: "true",
        message: books
    });
});

/**
 * Route: /books
 * Method: POST
 * Description: Create new book
 * Access: Public
 * Parameters: none
 */
 app.post("/", (req,res) =>{
    const {id,name,author,genre,price,publisher} = req.body;
    if(books.find((each) => each.id === id)){
        res.status(400).json({
            success: "false",
            message: "Book already exists"
        });    
        return;
    }

    books.push({id,name,author,genre,price,publisher});

    res.status(200).json({
        success: "true",
        message: books
    });
});

/**
 * Route: /books/:id
 * Method: GET
 * Description: Get single book by id
 * Access: Public
 * Parameters: id
 */
 app.get("/:id", (req,res) =>{
    const {id} = req.params;
    const book = books.find((each) => each.id === id);
    if(!book){
        res.status(200).json({
            success: "false",
            message: "Book not found"
        });
        return;
    }
    res.status(200).json({
        success: "true",
        message: book
    });
});

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update book by id
 * Access: Public
 * Parameters: id
 */
 app.put("/:id", (req,res) =>{
    const {id} = req.params;
    const {data} = req.body;
    const book = books.find((each) => each.id === id);
    if(!book){
        res.status(200).json({
            success: "false",
            message: "Book not found"
        });
        return;
    }
    const updatedBooks = books.map((each) => {
        if(each.id === id){
            return {...each, ...data};
        }
        return each;
    });

    res.status(200).json({
        success: "true",
        message: updatedBooks
    });
});

/**
 * Route: /books/issued/by-user
 * Method: GET
 * Description: Update book by id
 * Access: Public
 * Parameters: id
 */
 app.get("/issued/by-user", (req,res) =>{
    const {id} = req.params;
    const {data} = req.body;
    const issuedBooksIds = [];
    users.forEach((each) => {
        if(each.issuedBook){
            issuedBooksIds.push(each.issuedBook);
        }
    });

    if(issuedBooksIds.length == 0){
        res.status(200).json({
            success: "true",
            message: "No issued books"
        });
        return;
    }

    const issuedBooks = books.map((each) => {
        if(issuedBooksIds.includes(each.id)){
            return each;
        }
    });

    res.status(200).json({
        success: "true",
        message: issuedBooks
    });
});

/**
 * Route: /books/issued/withFine
 * Method: GET
 * Description: Update book by id
 * Access: Public
 * Parameters: id
 */
 app.get("/issued/withFine", (req,res) =>{
    const {id} = req.params;
    const {data} = req.body;
    const issuedBooksIds = [];
    users.forEach((each) => {
        if(each.issuedBook){
            let returnDate = new Date(each.returnDate);
            if(returnDate.getTime() < Date.now())
                issuedBooksIds.push(each.issuedBook);
        }
    });

    if(issuedBooksIds.length == 0){
        res.status(200).json({
            success: "true",
            message: "No issued books with fine"
        });
        return;
    }

    const issuedBooks = [];
    books.forEach((each) => {
        if(issuedBooksIds.includes(each.id)){
            issuedBooks.push(each);
        }
    });

    res.status(200).json({
        success: "true",
        message: issuedBooks
    });
});

module.exports = router;