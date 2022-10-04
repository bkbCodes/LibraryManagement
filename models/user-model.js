const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        issuedBook: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: false,
        },
        issuedDate: {
            type: Date,
            required: false,
        },
        returnDate: {
            type: Date,
            required: false,
        },
        subscriptionType: {
            type: String,
            required: true,
        },
        subscriptionDate: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// collection will have a name "users"
module.exports = mongoose.model("user", userSchema);