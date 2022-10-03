const express = require("express");
const app = express();
const PORT = 8080;

const usersRoute = require("./routes/users");
const booksRoute = require("./routes/books");

app.use(express.json());

app.get("/", (req,res) =>{
    res.status(200).json({
        message:"server is up and running"
    });
});

app.use('/users', usersRoute);

app.use('/books', booksRoute);

// (default route) if no route exists:
app.get("*", (req,res) => {
    res.status(404).json({
        message: "Route doesn't exist"
    });
})

app.listen(PORT, () =>{
    console.log("Server is running on: "+PORT);
});