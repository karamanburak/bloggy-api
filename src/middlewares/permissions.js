"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
// Middleware: permissions

const { CustomError } = require("../errors/customError");
const User = require("../models/user");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

module.exports = {
  isLogin: (req, res, next) => {
    if (req.user && req.user.isActive) {
      next();
    } else {
      throw new CustomError("NoPermission: You must login.", 403);
    }
  },
  isLoginStaffOrAdmin: (req, res, next) => {
    if (process.env.NODE_ENV == "development") return next();
    if (
      req.user &&
      req.user.isActive &&
      (req.user.isStaff || req.user.isAdmin)
    ) {
      next();
    } else {
      throw new CustomError(
        "NoPermission: You must login and to be Staff or Admin.",
        403
      );
    }
  },
  isLoginAdmin: (req, res, next) => {
    if (req.user && req.user.isActive && req.user.isAdmin) {
      next();
    } else {
      throw new CustomError(
        "NoPermission: You must login and to be Admin.",
        403
      );
    }
  },

  isStaffOrAdmin: (req, res, next) => {
    if (req.user.isStaff || req.user.isAdmin) {
      next();
    } else {
      throw new CustomError(
        "NoPermission: You must to be Staff or Admin.",
        403
      );
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user.isAdmin) {
      next();
    } else {
      throw new CustomError("NoPermission: You must to be Admin.", 403);
    }
  },

  isUserOwnerOrAdmin: async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (req.user.isAdmin || String(user._id) === String(req.user._id)) {
      next();
    } else {
      throw new CustomError(
        "No Permission: Only admin or owner can perform this action!",
        403
      );
    }
  },

  isBlogOwnerOrAdmin: async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if (req.user.isAdmin || String(blog.userId) === String(req.user._id)) {
      next();
    } else {
      throw new CustomError(
        "No Permission: Only admin or owner can perform this action!",
        403
      );
    }
  },

  isCommentOwnerOrAdmin: async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);
    if (req.user.isAdmin || String(comment.userId) === String(req.user._id)) {
      next();
    } else {
      throw new CustomError(
        "No Permission: Only admin or owner can perform this action!",
        403
      );
    }
  },
};
