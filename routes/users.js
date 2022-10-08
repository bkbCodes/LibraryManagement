const express = require("express");

const {users} = require("../data/users.json");
const {books} = require("../data/books.json");
const { getAllUsers, createNewUser, getSingleUserById, updateUserById, deleteUserById, getUserSubscriptionDetails } = require("../controllers/user-controller");

const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Description: Get all users
 * Access: Public
 * Parameters: none
 */
 router.get("/", getAllUsers);

/**
 * Route: /users
 * Method: POST
 * Description: Create a new user
 * Access: Public
 * Parameters: none
 */
router.post("/",createNewUser );

/**
 * Route: /users/:id
 * Method: GET
 * Description: Get single user by id
 * Access: Public
 * Parameters: id
 */
router.get("/:id", getSingleUserById);

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating user details
 * Access: Public
 * Parameters: id
 */
router.put("/:id", updateUserById);

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleting a user by id
 * Access: Public
 * Parameters: id
 */
router.delete("/:id", deleteUserById);


/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get user subscription details
 * Access: Public
 * Parameters: id
 */
router.get("/subscription-details/:id", getUserSubscriptionDetails);

module.exports = router;