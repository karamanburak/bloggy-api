"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const Blog = require("../models/blog");

module.exports = {
  list: async (req, res) => {
    /*
           #swagger.tags = ["Blogs"]
           #swagger.summary = "List Blogs"
           #swagger.parameters['author'] = {
            in: 'query',
            name: 'author',
        }
           #swagger.description = `
               You can send query with endpoint for search[], sort[], page and limit.
               <ul> Examples:
                   <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                   <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                   <li>URL/?<b>page=2&limit=1</b></li>
               </ul>
           `
       */

    // isPublish = true
    const customFilter = req.query?.author
      ? { userId: req.user.author }
      : { isPublish: true };

    const blogs = await res.getModelList(Blog, customFilter, [
      { path: "userId", select: "username firstName lastName image" },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Blog, customFilter),
      totalRecords: blogs.length,
      blogs,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Create Blog"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
            }
        }
    */

    // Add logined userId to req.body
    req.body.userId = req.user?._id;

    const newBlog = await Blog.create(req.body);
    res.status(201).send({
      error: false,
      newBlog,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Get Single Blog"
    */
    // Single
    const blog = await Blog.findOne({ _id: req.params.id }).populate([
      { path: "userId", select: "username firstName lastName" },
      { path: "categoryId", select: "name" },
      {
        path: "comments",
        populate: { path: "userId", select: "username firstName lastName" },
      },
    ]);

    res.status(200).send({
      error: false,
      blog,
    });
  },
  update: async (req, res) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Update Blog"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
            }
        }
    */

    const customFilter =
      req.user && !req.user.isAdmin ? { userId: req.user._id } : {};

    const blog = await Blog.updateOne(
      { _id: req.params.id, ...customFilter },
      req.body,
      {
        runValidators: true,
      }
    );
    res.status(202).send({
      error: false,
      blog,
      updatedBlog: await Blog.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Delete Blog"
    */

    const customFilter =
      req.user && !req.user.isAdmin ? { userId: req.user._id } : {};

    const blog = await Blog.deleteOne({ _id: req.params.id, ...customFilter });
    res.status(blog.deletedCount ? 204 : 404).send({
      error: !blog.deletedCount,
      blog,
      message: "Blog not found",
    });
  },
};
