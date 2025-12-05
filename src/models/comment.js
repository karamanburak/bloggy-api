"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    comment: {
        type: String,
        trim: true,
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ]
}, {
    collection: "comments",
    timestamps: true
})

module.exports = mongoose.model("Comment", CommentSchema)