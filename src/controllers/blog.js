"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const Blog = require("../models/blog")

module.exports = {
    list: async (req, res) => {
        const blogs = await res.getModelList(Blog)
        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Blog),
            totalRecords: blogs.length,
            blogs,
        })
    },
    create: async (req, res) => {
        const newBlog = await Blog.create(req.body)
        res.status(201).send({
            error: false,
            newBlog
        })
    },
    read: async (req, res) => {
        // Single
        const blog = await Blog.findOne({ _id: req.params.id })
        res.status(200).send({
            error: false,
            blog
        })
    },
    update: async (req, res) => {
        const blog = await Blog.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
        res.status(202).send({
            error: false,
            blog,
            updatedBlog: await Blog.findOne({ _id: req.params.id })
        })
    },
    delete: async (req, res) => {
        const blog = await Blog.deleteOne({ _id: req.params.id })
        res.status(blog.deletedCount ? 204 : 404).send({
            error: !blog.deletedCount,
            blog,
            message: "Blog not found"

        })
    },
}