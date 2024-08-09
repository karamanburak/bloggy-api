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
    const comments = await res.getModelList(Comment);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Comment),
      totalRecords: comments.length,
      comments,
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

    const newComment = await Comment.create(req.body);

    const blog = await Blog.findById(req.body.blogId);
    blog.comments.push(newComment._id);
    await blog.save();

    res.status(201).send({
      error: false,
      newComment,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Get Single Comment"
    */
    // Single
    const comment = await Comment.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      comment,
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
    const comment = await Comment.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      comment,
      updatedComment: await Comment.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Delete Comment"
    */
    const comment = await Comment.deleteOne({ _id: req.params.id });
    res.status(comment.deletedCount ? 204 : 404).send({
      error: !comment.deletedCount,
      comment,
      message: "Comment not found",
    });
  },
};
