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
                <li>URL/?<b>blogId=ObjectId</b> - Filter comments by blog ID</li>
            </ul>
        `
    */
    // Build filter - if blogId is provided, filter by it
    const filter = { parentCommentId: null };
    if (req.query.blogId) {
      filter.blogId = req.query.blogId;
    }
    
    const data = await res.getModelList(Comment, filter, [
      { path: "userId", select: "username firstName lastName image" },
      { path: "likes", select: "username firstName lastName image" },
      { path: "dislikes", select: "username firstName lastName image" },
    ]);
    
    // Populate replies for each comment
    const commentsWithReplies = await Promise.all(
      data.map(async (comment) => {
        const replies = await Comment.find({ parentCommentId: comment._id })
          .populate("userId", "username firstName lastName image")
          .populate("likes", "username firstName lastName image")
          .populate("dislikes", "username firstName lastName image")
          .sort({ createdAt: 1 });
        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Comment, filter),
      totalRecords: commentsWithReplies.length,
      data: commentsWithReplies,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Create Comment or Reply"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                "blogId": "ObjectId (required for top-level comments, auto-filled for replies)",
                "comment": "string",
                "parentCommentId": "ObjectId (optional, for replies)"
            }
        }
    */

    // Add logged in userId to req.body if user is authenticated
    if (req.user && req.user._id) {
      req.body.userId = req.user._id;
    } else if (!req.body.userId) {
      return res.status(401).send({
        error: true,
        message: "Authentication required. Please login to create a comment.",
      });
    }

    // If it's a reply, validate parent comment and get blogId from parent
    if (req.body.parentCommentId) {
      const parentComment = await Comment.findById(req.body.parentCommentId);
      if (!parentComment) {
        return res.status(404).send({
          error: true,
          message: "Parent comment not found",
        });
      }
      
      // Prevent nested replies - parent comment must be a top-level comment
      if (parentComment.parentCommentId) {
        return res.status(400).send({
          error: true,
          message: "Cannot reply to a reply. You can only reply to top-level comments.",
        });
      }
      
      // Use parent comment's blogId
      req.body.blogId = parentComment.blogId;
    }

    const blog = await Blog.findById(req.body.blogId);
    if (!blog) {
      return res.status(404).send({
        error: true,
        message: "Blog not found",
      });
    }

    const data = await Comment.create(req.body);

    // Only add to blog.comments if it's not a reply
    if (!req.body.parentCommentId) {
      blog.comments.push(data._id);
      await blog.save();
    }

    // Populate userId, likes and dislikes for response
    const populatedData = await Comment.findById(data._id)
      .populate("userId", "username firstName lastName image")
      .populate("likes", "username firstName lastName image")
      .populate("dislikes", "username firstName lastName image");

    res.status(201).send({
      error: false,
      message: req.body.parentCommentId
        ? "Reply successfully created"
        : "Comment successfully created",
      data: populatedData,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Get Single Comment"
    */
    // Single
    const data = await Comment.findOne({ _id: req.params.id })
      .populate("userId", "username firstName lastName image email")
      .populate("parentCommentId", "comment userId")
      .populate("likes", "username firstName lastName image")
      .populate("dislikes", "username firstName lastName image");

    if (!data) {
      return res.status(404).send({
        error: true,
        message: "Comment not found!",
      });
    }

    // If it's a parent comment, get replies
    let replies = [];
    if (!data.parentCommentId) {
      replies = await Comment.find({ parentCommentId: data._id })
        .populate("userId", "username firstName lastName image")
        .populate("likes", "username firstName lastName image")
        .populate("dislikes", "username firstName lastName image")
        .sort({ createdAt: 1 });
    }

    res.status(200).send({
      error: false,
      data: {
        ...data.toObject(),
        replies: replies.length > 0 ? replies : [],
      },
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
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).send({
        error: true,
        message: "Comment not found!",
      });
    }

    // If it's a parent comment, delete all replies first
    if (!comment.parentCommentId) {
      await Comment.deleteMany({ parentCommentId: comment._id });
      
      // Remove from blog.comments array
      const blog = await Blog.findById(comment.blogId);
      if (blog) {
        blog.comments = blog.comments.filter(
          (id) => String(id) !== String(comment._id)
        );
        await blog.save();
      }
    }

    const data = await Comment.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 200 : 404).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "Comment successfully deleted"
        : "Comment not found!",
      data,
    });
  },
  toggleLike: async (req, res) => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Toggle Like on Comment or Reply"
    */

    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).send({
        error: true,
        message: "Comment not found!",
      });
    }

    // Check if the user has already liked the comment
    const userId = req.user._id;
    const hasLiked = comment.likes && comment.likes.some(
      (id) => String(id) === String(userId)
    );

    // Check if user has disliked - if yes, remove from dislikes
    const hasDisliked = comment.dislikes && comment.dislikes.some(
      (id) => String(id) === String(userId)
    );

    if (hasLiked) {
      // Remove like
      comment.likes = comment.likes.filter(
        (id) => String(id) !== String(userId)
      );
    } else {
      // Add like and remove dislike if exists
      if (!comment.likes) {
        comment.likes = [];
      }
      comment.likes.push(userId);
      
      // Remove from dislikes if user had disliked
      if (hasDisliked) {
        comment.dislikes = comment.dislikes.filter(
          (id) => String(id) !== String(userId)
        );
      }
    }

    await comment.save();

    // Populate likes and dislikes for response
    const populatedComment = await Comment.findById(comment._id)
      .populate("userId", "username firstName lastName image")
      .populate("likes", "username firstName lastName image")
      .populate("dislikes", "username firstName lastName image");

    res.status(200).send({
      error: false,
      message: hasLiked
        ? "Comment unliked successfully"
        : "Comment liked successfully",
      data: populatedComment,
    });
  },
  toggleDislike: async (req, res) => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Toggle Dislike on Comment or Reply"
    */

    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).send({
        error: true,
        message: "Comment not found!",
      });
    }

    // Check if the user has already disliked the comment
    const userId = req.user._id;
    const hasDisliked = comment.dislikes && comment.dislikes.some(
      (id) => String(id) === String(userId)
    );

    // Check if user has liked - if yes, remove from likes
    const hasLiked = comment.likes && comment.likes.some(
      (id) => String(id) === String(userId)
    );

    if (hasDisliked) {
      // Remove dislike
      comment.dislikes = comment.dislikes.filter(
        (id) => String(id) !== String(userId)
      );
    } else {
      // Add dislike and remove like if exists
      if (!comment.dislikes) {
        comment.dislikes = [];
      }
      comment.dislikes.push(userId);
      
      // Remove from likes if user had liked
      if (hasLiked) {
        comment.likes = comment.likes.filter(
          (id) => String(id) !== String(userId)
        );
      }
    }

    await comment.save();

    // Populate dislikes and likes for response
    const populatedComment = await Comment.findById(comment._id)
      .populate("userId", "username firstName lastName image")
      .populate("likes", "username firstName lastName image")
      .populate("dislikes", "username firstName lastName image");

    res.status(200).send({
      error: false,
      message: hasDisliked
        ? "Comment undisliked successfully"
        : "Comment disliked successfully",
      data: populatedComment,
    });
  },
};
