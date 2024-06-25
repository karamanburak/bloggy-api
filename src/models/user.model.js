const mongoose = require("mongoose")


// const crypto = require('node:crypto')

// const keyCode = process.env.SECRET_KEY
// const loopCount = 10000
// const charCount = 32 // write 32 for 64
// const encType = 'sha512'

// const passwordEncrypt = (password) => {
//   // const newPass = crypto.pbkdf2Sync(password,keyCode,loopCount,charCount,encType).toString("hex");
//   // console.log(newPass)
//   return crypto
//     .pbkdf2Sync(password, keyCode, loopCount, charCount, encType)
//     .toString("hex");
// }

// passwordEncrypt("123456")
// passwordEncrypt("1234576")

//* bu işlemi daha temiz olması açısından ayrı bir dosyaya taşıdık
const passwordEncrypt = require("../helpers/paswordEncrypt")

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
        validate: [
            (email) => (email.includes("@") && email.split('@')[1].includes(".")),
            "Email is invalid"]
        //* regex ifadeleriyle daha kapsamli bir validasyon yapilabilir. true dönerse validasyondan gecer, false dönerse kalir.
    },
    password: {
        type: String,
        trim: true,
        required: true,
        // set: (password) => "martin" //* kullanici sifre olarak ne girerse girsin db ye martin olarak kaydolur
        set: (password) => passwordEncrypt(password)//* set; db ye kaydolurken veriyi işlemden geçirerk kaydolmasını sağlar
        //! db ye şifre bilgileri güvenlik amaçlı doğrudan eklenmez. Hashlenmiş bir şekilde veritabanına eklenir.
    },
    firstName: String,
    lastName: String
}, {
    collection: "user",
    timestamps: true
})

module.exports = mongoose.model("User", UserSchema)