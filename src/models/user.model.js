const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    firstName: String,
    lastName: String
}, {
    collection: "user",
    timestamps: true
})

module.exports.mongoose.Model("User", UserSchema)