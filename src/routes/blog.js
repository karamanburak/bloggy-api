"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const blog = require("../controllers/blog");
const permission = require("../middlewares/permissions");

// URL: /blogs

router.route("/").get(blog.list).post(permission.isLogin, blog.create);
router
  .route("/:id")
  .get(permission.isAdminOrStaffOrOwn, blog.read)
  .put(permission.isAdminOrStaffOrOwn, blog.update)
  .patch(permission.isAdminOrStaffOrOwn, blog.update)
  .delete(permission.isAdminOrStaffOrOwn, blog.delete);

/* ------------------------------------------------------- */
module.exports = router;
