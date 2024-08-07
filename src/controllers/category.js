"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */

const Category = require("../models/category")

module.exports = {
    list: async (req, res) => {
        const categories = await res.getModelList(Category)
        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Category),
            totalRecords: categories.length,
            categories,
        })
    },
    create: async (req, res) => {
        const newCategory = await Category.create(req.body)
        res.status(201).send({
            error: false,
            newCategory
        })
    },
    read: async (req, res) => {
        // Single
        const category = await Category.findOne({ _id: req.params.id })
        res.status(200).send({
            error: false,
            category
        })
    },
    update: async (req, res) => {
        const category = await Category.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
        res.status(202).send({
            error: false,
            category,
            updatedCategory: await Category.findOne({ _id: req.params.id })
        })
    },
    delete: async (req, res) => {
        const category = await Category.deleteOne({ _id: req.params.id })
        res.status(category.deletedCount ? 204 : 404).send({
            error: !category.deletedCount,
            category,
            message: "Category not found"

        })
    },
}