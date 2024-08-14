"use strict";
const sendMail = require("../helpers/sendMail");
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

    const data = await (
      await Blog.create(req.body)
    ).populate([
      { path: "userId", select: "username firstName lastName email" },
      { path: "categoryId", select: "name" },
    ]);
    // console.log(req.body);
    const isPublished = data.isPublish;
    const blogTitle = isPublished ? data.title : `[DRAFT] ${data.title}`;

    // Send email when new blog is created
    sendMail(
      req.user.email,
      "Blog successfully created",
      `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your New Blog Post on Blogyy</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .email-header {
                background-color: #007BFF;
                color: #ffffff;
                padding: 20px;
                text-align: center;
            }
            .email-body {
                padding: 20px;
            }
            .email-footer {
                background-color: #f4f4f4;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                color: #777;
            }
            .blog-title {
                color: #007BFF;
                font-size: 24px;
                margin-bottom: 10px;
            }
            .blog-category {
                font-size: 16px;
                color: #666;
                margin-bottom: 20px;
            }
            .blog-content {
                font-size: 14px;
                line-height: 1.6;
                color: #333;
            }
            .blog-image {
                margin: 20px 0;
                text-align: center;
            }
            .blog-image img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>${
                  isPublished
                    ? "Congratulations on Publishing Your New Blog!"
                    : "Your Draft Blog Post on Blogyy"
                }</h1>
            </div>
            <div class="email-body">
                <h2 class="blog-title"> ${blogTitle}</h2>
                <p class="blog-category">Category: ${data.categoryId.name}</p>
                <div class="blog-image">
                    <img src=" ${data.image[0]}" alt="Blog Image">
                </div>
                                <div class="blog-content">
                    <p>${data.content}</p>
                </div>
                <p>Thank you for sharing your thoughts with the world through Blogyy!</p>
            </div>
            <div class="email-footer">
                <p>Blogyy &copy; 2024 | All Rights Reserved</p>
            </div>
        </div>
    </body>
    </html>`
    );

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
