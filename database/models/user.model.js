import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true,
        minlength: [3, "Username should be at least 3 characters long."],
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        match: [
            /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
            "Please provide a valid email address.",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [6, "Password should be at least 6 characters long."],
    },
    firstName: {
        type: String,
        required: [true, "First name is required."],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required."],
    },
    address: String,
    phoneNumber: {
        type: String,
        match: [/^\d{10}$/, "Phone number should be a 10-digit numeric value."],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", userSchema);

export default User;
