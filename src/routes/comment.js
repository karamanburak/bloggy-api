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

router
  .route("/")
  .get(permission.isLoginStaffOrAdmin, comment.list)
  .post(comment.create);
router
  .route("/:id")
  .all(idValidation)
  .get(comment.read)
  .put(permission.isCommentOwnerOrAdmin, comment.update)
  .patch(permission.isCommentOwnerOrAdmin, comment.update)
  .delete(permission.isCommentOwnerOrAdmin, comment.delete);

/* ------------------------------------------------------- */
module.exports = router;
