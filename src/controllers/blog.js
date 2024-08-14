"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const Blog = require("../models/blog");
const User = require("../models/user");

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

    data.countOfVisitors += 1;

    // Save the changes
    await data.save();

    /* -------------------------------------------------------------------------- */
    // Check if the user's ID is already in visitedUsers array

    // if (req.user) {
    //   // Fetch the full user document
    //   const user = await User.findById(req.user._id);

    //   if (!user) {
    //     return res.status(404).send({
    //       error: true,
    //       message: "User not found!",
    //     });
    //   }

    //   // Check if the user's ID is already in visitedUsers array
    //   if (!data.visitedUsers.includes(user._id)) {
    //     data.visitedUsers.push(user._id);

    //     // Save the updated blog document
    //     await data.save();
    //   }

    //   // Initialize visitedBlogs if it doesn't exist
    //   user.visitedBlogs = user.visitedBlogs || [];

    //   // Check if the user has visited this blog before
    //   if (!user.visitedBlogs.includes(req.params.id)) {
    //     user.visitedBlogs.push(req.params.id);

    //     // Save the updated user document
    //     await user.save();
    //   }
    // }
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

    const blog = await Blog.findById(req.params.id);

    if (
      req.user._id.toString() !== blog.userId.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).send({
        error: true,
        message:
          "NoPermission: You must be the owner or an admin to update this blog.",
      });
    }

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
      new: data,
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

    const blog = await Blog.findById(req.params.id);

    if (
      req.user._id.toString() !== blog.userId.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).send({
        error: true,
        message:
          "NoPermission: You must be the owner or an admin to delete this blog.",
      });
    }

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

  toggleLike: async (req, res) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Toggle Like on Blog"
    */

    const blog = await Blog.findById(req.params.id);

    // Check if the user has already liked the blog
    const userId = req.user._id;
    const hasLiked = blog.likes.includes(userId);

    if (hasLiked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).send({
      error: false,
      message: hasLiked
        ? "Blog unliked successfully"
        : "Blog liked successfully",
      data: blog,
    });
  },
};
