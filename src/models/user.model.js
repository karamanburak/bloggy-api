const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        //     validate: [(email) => {
        //         if (email.includes("@") && email.split('@')[1].includes(".")) {
        //             return true;
        //         }
        //         return false
        //     }, "Email is invalid"]
        // },
        validate: [(email) =>
            (email.includes("@") && email.split('@')[1].includes(".")), "Email is invalid"]
        //* regex ifadeleriyle daha kapsamli bir validasyon yapilabilir. true dönerse validasyondan gecer, false dönerse kalir.
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

module.exports = mongoose.model("User", UserSchema)