"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const comment = require("../controllers/comment");
const idValidation = require("../middlewares/idValidation");
const permission = require("../middlewares/permissions");

// URL: /comments

router.route("/").get(comment.list).post(comment.create);
router.route("/:id/postLike").post(permission.isLogin, idValidation, comment.toggleLike);
router.route("/:id/postDislike").post(permission.isLogin, idValidation, comment.toggleDislike);
router
  .route("/:id")
  .all(idValidation)
  .get(comment.read)
  .put(permission.isCommentOwnerOrAdmin, comment.update)
  .patch(permission.isCommentOwnerOrAdmin, comment.update)
  .delete(permission.isCommentOwnerOrAdmin, comment.delete);

/* ------------------------------------------------------- */
module.exports = router;
