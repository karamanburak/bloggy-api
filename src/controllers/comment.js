"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const Comment = require("../models/comment")

module.exports = {
    list: async (req, res) => {
        const comments = await res.getModelList(Comment)
        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Comment),
            totalRecords: comments.length,
            comments,
        })
    },
    create: async (req, res) => {
        const newComment = await Comment.create(req.body)
        res.status(201).send({
            error: false,
            newComment
        })
    },
    read: async (req, res) => {
        // Single
        const comment = await Comment.findOne({ _id: req.params.id })
        res.status(200).send({
            error: false,
            comment
        })
    },
    update: async (req, res) => {
        const comment = await Comment.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
        res.status(202).send({
            error: false,
            comment,
            updatedComment: await Comment.findOne({ _id: req.params.id })
        })
    },
    delete: async (req, res) => {
        const comment = await Comment.deleteOne({ _id: req.params.id })
        res.status(comment.deletedCount ? 204 : 404).send({
            error: !comment.deletedCount,
            comment,
            message: "Comment not found"

        })
    },
}