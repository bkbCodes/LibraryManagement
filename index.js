const express = require("express");
const app = express();
const PORT = 8080;

const {users} = require("./data/users.json");
const {books} = require("./data/books.json");

app.use(express.json());

app.get("/", (req,res) =>{
    res.status(200).json({
        message:"server is up and running"
    });
});

/**
 * Route: /users
 * Method: GET
 * Description: Get all users
 * Access: Public
 * Parameters: none
 */
app.get("/users", (req,res) =>{
    res.status(200).json({
        success: "true",
        message: users
    });
});

/**
 * Route: /users
 * Method: POST
 * Description: Create a new user
 * Access: Public
 * Parameters: none
 */
app.post("/users", (req,res) => {
    let {id, name, surname, email, subscriptionType, subscriptionDate} = req.body;
    let found = users.find((each) => each.id === id);
    if(found){
        res.status(400).json({
            success: "false",
            message: "User already exists",
        });
        return;
    }

    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType, 
        subscriptionDate
    });
    res.status(200).json({
        success: "true",
        message: users,
    });
});

/**
 * Route: /users/:id
 * Method: GET
 * Description: Get single user by id
 * Access: Public
 * Parameters: id
 */
app.get("/users/:id", (req,res) => {
    let {id} = req.params;
    const user = users.find((each) => each.id === id);

    if(!user){
        res.status(404).json({
            success: false,
            message: "User not found",
        });
        return;
    }

    res.status(200).json({
        success: true,
        message: user,
    });
});

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating user details
 * Access: Public
 * Parameters: id
 */
app.put("/users/:id", (req,res) => {
    let {id} = req.params;
    let {data} = req.body;

    let user = users.find((each) => each.id == id);

    if(!user) return res.status(400).json({ success: "false", message: "User not found"});

    const updatedUser = users.map((each) => {
        if( each.id === id){
            return {
                ...each,
                ...data
            };
        }
        return each;
    })

    res.status(200).json({
        success: "true",
        data: updatedUser,
    });
});

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleting a user by id
 * Access: Public
 * Parameters: id
 */
app.delete("/users/:id", (req,res) => {
    let id = req.params.id;
    if(!users.find((each) => each.id === id)){
        res.status(200).json({
            success: "true",
            message: "User not found",
        });
        return;
    }

    users.forEach((each,ind) => {
        if(each.id == id){
            const returnDate = new Date(each.returnDate);
            if(each.issuedBook){
                if(returnDate.getTime() < Date.now()){
                    res.status(405).json({
                        success: "false",
                        message: "User cannot be deleted due to pending fine",
                    });
                }
                else{
                    res.status(405).json({
                        success: "false",
                        message: "User cannot be deleted, still have issued book",
                    });
                }
            }
            else{
                users.splice(ind,1);
                res.status(200).json({
                    success: "true",
                    message: "User delete successfully",
                    data: users,
                });
            }
            return;
        }
    });
});


/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get user subscription details
 * Access: Public
 * Parameters: id
 */
app.get("/users/subscription-details/:id", (req,res) =>{
    const {id} = req.params;
    const user = users.find((each) => each.id === id);
    if(!user){
        res.status(404).json({
            success: "false",
            message: "User not found",
        });
        return;
    }
    
    // date is in mm/dd/yyyy format
    const subscriptionDate = new Date(user.subscriptionDate);
    let validTill;
    let fine = 0;

    const months = 30*24*60*60*1000;

    if(user.subscriptionType === "Basic")
        validTill = new Date(subscriptionDate.getTime() + (3*months));
    if(user.subscriptionType === "Standard")
        validTill = new Date(subscriptionDate.getTime() + (6*months));
    if(user.subscriptionType === "Premium")
        validTill = new Date(subscriptionDate.getTime() + (12*months));
    
    // if the user has issued a book
    if(user.issuedBook){
        // if user has pending fine then update fine if needed
        fine = user.fine ? user.fine : 0;
        const returnDate = new Date(user.returnDate);
        if(returnDate.getTime() < Date.now()){
            fine+=100;
            if(validTill.getTime() < Date.now())
                fine+=200;
        }
    }

    res.status(200).json({
        success: "true",
        data: {
            "Date of Subscription:" : subscriptionDate.toString(),
            "Valid till" : validTill.toString(),
            "Fine" : fine,
        },
    })
});

/**
 * Route: /books
 * Method: GET
 * Description: Get all books
 * Access: Public
 * Parameters: none
 */
 app.get("/books", (req,res) =>{
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
 app.post("/books", (req,res) =>{
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
 app.get("/books/:id", (req,res) =>{
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
 app.put("/books/:id", (req,res) =>{
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
 app.get("/books/issued/by-user", (req,res) =>{
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
 app.get("/books/issued/withFine", (req,res) =>{
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

// (default route) if no route exists:
app.get("*", (req,res) => {
    res.status(404).json({
        message: "Route doesn't exist"
    });
})

app.listen(PORT, () =>{
    console.log("Server is running on: "+PORT);
});