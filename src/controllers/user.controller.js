const User = require("../models/user.model")

module.exports = {
    list: async (req, res) => {
        // const data = await User.find()
        const data = await User.find().select("-password") //* Password gelmesin
        res.status(200).send({
            error: false,
            users: data
        })
    },
    create: async (req, res) => {
        const user = await User.create(req.body)
        res.status(201).send({
            error: false,
            message: "User created successfully",
            user
        })
    },
    read: async (req, res) => {
        const user = await User.findOne({ _id: req.params.userId })
        res.status(200).send({
            error: false,
            user
        })
    },
    update: async (req, res) => {
        const data = await User.updateOne({ _id: req.params.userId }, req.body)
        res.status(202).send({
            error: false,
            message: "User updated successfully!",
            result: data,
            user: await User.findOne({ _id: req.params.userId })

        })
    },
    delete: async (req, res) => {
        const data = await User.deleteOne({ _id: req.params.userId })
        if (data.deletedCount) {
            res.sendStatus(204)
        } else {
            res.status(404).send({
                error: true,
                message: "User not found"
            })
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body

        if (email && password) {
            // const user = await User.findOne({ email: email })
            const user = await User.findOne({ email })
            if (user) {
                if (user.password == password) {
                    res.status(200).send({
                        error: false,
                        message: "Login Ok!",
                        user
                    })
                } else {
                    res.errorStatusCode = 401
                    throw new Error("Password didn't matched!")
                }
            } else {
                res.errorStatusCode = 401
                throw new Error("User not found!")
            }
        } else {
            res.errorStatusCode = 401
            throw new Error("Email and password are required!")
        }

    },
    logout: async (req, res) => { },
};

