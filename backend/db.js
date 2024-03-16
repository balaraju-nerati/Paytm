const mongoose = require("mongoose");
const { Schema } = require("zod");

require('dotenv').config();

const key = process.env.DB_KEY;

mongoose.connect(`mongodb+srv://admin:${key}@cluster0.pqkknov.mongodb.net/paytmApp`)
.then(() =>console.log("connected to MongoDB"))
.catch((err) => console.error('Failed to connect to MongoDB',err))

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 30

    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        maxLength: 30
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 30
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model("User",userSchema);
const Account = mongoose.model("Account",accountSchema);

module.exports = {
    User,
    Account
};