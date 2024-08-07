"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */

const Token = require("../models/token.js")

module.exports = {
    list: async (req, res) => {
        const tokens = await res.getModelList(Token)
        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Token),
            totalRecords: tokens.length,
            tokens
        })
    },
    create: async (req, res) => {
        const newToken = await Token.create(req.body)
        res.status(201).send({
            error: false,
            newToken
        })
    },
    read: async (req, res) => {
        const token = await Token.findOne({ _id: req.params.id })
        res.status(200).send({
            error: false,
            token
        })
    },
    update: async (req, res) => {
        const token = await Token.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
        res.status(202).send({
            error: false,
            token,
            updatedToken: await Token.findOne({ _id: req.params.id })
        })
    },
    delete: async (req, res) => {
        const token = await Token.deleteOne({ _id: req.params.id })
        res.status(token.deletedCount ? 204 : 404).send({
            error: !token.deletedCount,
            token,
            message: "User not found"
        })
    },

}