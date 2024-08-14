"use strict";
/* -------------------------------------------------------
NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const Comment = require("../models/comment");
const Blog = require("../models/blog");

module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "List Comments"
        #swagger.description = `
            You can send query with endpoint for search[], sort[], page and limit.
            <ul> Examples:
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                <li>URL/?<b>page=2&limit=1</b></li>
            </ul>
        `
    */
    const data = await res.getModelList(Comment, {}, [
      { path: "userId", select: "username firstName lastName image" },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Comment),
      totalRecords: data.length,
      data,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Create Comment"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
            }
        }
    */

    const data = await Comment.create(req.body);

    const blog = await Blog.findById(req.body.blogId);
    if (!blog) {
      return res.status(404).send({
        error: true,
        message: "Blog not found",
      });
    }
    blog.comments.push(data._id);
    await blog.save();

    res.status(201).send({
      error: false,
      message: "Comment successfully created",
      data,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Get Single Comment"
    */
    // Single
    const data = await Comment.findOne({ _id: req.params.id }).populate(
      "userId",
      "username firstName lastName image email"
    );
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Update Comment"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
            }
        }
    */
    const data = await Comment.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      message: "Comment successfully updated",
      data,
      new: await Comment.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Delete Comment"
    */
    const data = await Comment.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 200 : 404).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "Comment successfully deleted"
        : "Comment not found!",
      data,
    });
  },
};
