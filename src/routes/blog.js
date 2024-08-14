"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const blog = require("../controllers/blog");
const permission = require("../middlewares/permissions");
const upload = require("../middlewares/upload");
// URL: /blogs

router
  .route("/")
  .get(blog.list)
  .post(permission.isLogin, upload.array("images"), blog.create);
router.route("/:id/like").put(permission.isLogin, blog.toggleLike);
router
  .route("/:id")
  .get(permission.isLogin, blog.read)
  .put(permission.isBlogOwnerOrAdmin, upload.array("images"), blog.update)
  .patch(permission.isBlogOwnerOrAdmin, upload.array("images"), blog.update)
  .delete(permission.isBlogOwnerOrAdmin, blog.delete);

/* ------------------------------------------------------- */
module.exports = router;
