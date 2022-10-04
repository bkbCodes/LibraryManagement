const express = require("express");

const {users} = require("../data/users.json");
const {books} = require("../data/books.json");

const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Description: Get all users
 * Access: Public
 * Parameters: none
 */
 app.get("/", (req,res) =>{
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
app.post("/", (req,res) => {
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
app.get("/:id", (req,res) => {
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
app.put("/:id", (req,res) => {
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
app.delete("/:id", (req,res) => {
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
app.get("/subscription-details/:id", (req,res) =>{
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

module.exports = router;