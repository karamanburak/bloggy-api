"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */

const Category = require("../models/category")

module.exports = {
    list: async (req, res) => {
        /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "List Categories"
        #swagger.description = `
            You can send query with endpoint for search[], sort[], page and limit.
            <ul> Examples:
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                <li>URL/?<b>page=2&limit=1</b></li>
            </ul>
        `
    */
        const categories = await res.getModelList(Category)
        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Category),
            totalRecords: categories.length,
            categories,
        })
    },
    create: async (req, res) => {
        /*
          #swagger.tags = ["Categories"]
          #swagger.summary = "Create Category"
          #swagger.parameters['body'] = {
              in: 'body',
              required: true,
              schema: {
              }
          }
      */
        const newCategory = await Category.create(req.body)
        res.status(201).send({
            error: false,
            newCategory
        })
    },
    read: async (req, res) => {
        /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "Get Single Category"
    */
        // Single
        const category = await Category.findOne({ _id: req.params.id })
        res.status(200).send({
            error: false,
            category
        })
    },
    update: async (req, res) => {
        /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "Update Category"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
            }
        }
    */
        const category = await Category.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
        res.status(202).send({
            error: false,
            category,
            updatedCategory: await Category.findOne({ _id: req.params.id })
        })
    },
    delete: async (req, res) => {
        /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "Delete Category"
    */
        const category = await Category.deleteOne({ _id: req.params.id })
        res.status(category.deletedCount ? 204 : 404).send({
            error: !category.deletedCount,
            category,
            message: "Category not found"

        })
    },
}