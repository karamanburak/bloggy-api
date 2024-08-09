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

    const data = await res.getModelList(Blog, customFilter, [
      { path: "userId", select: "username firstName lastName image" },
      { path: "categoryId", select: "name" },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Blog, customFilter),
      totalRecords: data.length,
      data,
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

    const data = await Blog.create(req.body);
    res.status(201).send({
      error: false,
      message: "New Blog successfully created",
      data,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Get Single Blog"
    */
    // Single
    const data = await Blog.findOne({ _id: req.params.id }).populate([
      { path: "userId", select: "username firstName lastName" },
      { path: "categoryId", select: "name" },
      { path: "comments" },
    ]);

    /* -------------------------------------------------------------------------- */
    // Check if the user's ID is already in visitedUsers array
    // if (!data.visitedUsers.includes(req.user._id)) {
    if (
      data.visitedUsers &&
      Array.isArray(data.visitedUsers) &&
      !data.visitedUsers.includes(req.user._id)
    ) {
      // If not, push the user's ID to visitedUsers array
      data.visitedUsers.push(req.user._id);

      // Increment countOfVisitors for the blog
      data.countOfVisitors++;

      // Save the changes
      await data.save();
    }

    // Check if the user has visited this blog before
    // if (!req.user.visitedBlogs.includes(req.params.id)) {
    if (
      req.user?.visitedBlogs &&
      Array.isArray(req.user.visitedBlogs) &&
      !req.user?.visitedBlogs.includes(req.params.id)
    ) {
      // If not, mark the blog as visited for this user
      req.user.visitedBlogs.push(req.params.id);

      // Save the changes to the user model
      await req.user.save();
    }

    res.status(200).send({
      error: false,
      data,
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

    const data = await Blog.updateOne(
      { _id: req.params.id, ...customFilter },
      req.body,
      {
        runValidators: true,
      }
    );
    res.status(202).send({
      error: false,
      message: "Blog successfully updated",
      data,
      new: await Blog.findOne({ _id: req.params.id }).populate([
        { path: "userId", select: "username firstName lastName image email" },
        { path: "categoryId", select: "name" },
      ]),
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Delete Blog"
    */

    const customFilter =
      req.user && !req.user.isAdmin ? { userId: req.user._id } : {};

    const data = await Blog.deleteOne({ _id: req.params.id, ...customFilter });
    res.status(data.deletedCount ? 200 : 404).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "Blog successfully deleted"
        : "Blog not found!",
      data,
    });
  },
};
