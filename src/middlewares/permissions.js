"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
// Middleware: permissions

const { CustomError } = require("../errors/customError");
const Blog = require("../models/blog");

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
    if (process.env.NODE_ENV == "development") return next(); //* development ortmaında permissionlara takılmamk için
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
  isAdminOrStaffOrOwn: async (req, res, next) => {
    // Ensure the logged-in user is admin, staff, or the owner of the blog

    try {
      const blog = await Blog.findById(req.params.id); // Retrieve the blog using the ID from request params

      if (!blog) {
        throw new CustomError("Blog not found", 404);
      }

      // Check if the user is an admin, staff, or the blog owner
      if (
        !req.user.isAdmin &&
        !req.user.isStaff &&
        blog.userId.toString() !== req.user._id.toString()
      ) {
        throw new CustomError(
          "NoPermission! You must be admin, staff, or the owner of the blog!",
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  },
};
