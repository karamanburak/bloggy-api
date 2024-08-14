"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const category = require("../controllers/category");
const idValidation = require("../middlewares/idValidation");
const permission = require("../middlewares/permissions");

// URL: /categories

router
  .route("/")
  .get(category.list)
  .post(permission.isLoginAdmin, category.create);
router
  .route("/:id")
  .all(idValidation)
  .get(category.read)
  .put(permission.isLoginAdmin, category.update)
  .patch(permission.isLoginAdmin, category.update)
  .delete(permission.isLoginAdmin, category.delete);

/* ------------------------------------------------------- */
module.exports = router;
