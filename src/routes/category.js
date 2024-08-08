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

router.route("/").get(category.list).post(category.create);
router
  .route("/:id")
  .all(idValidation)
  .get(category.read)
  .put(category.update)
  .patch(category.update)
  .delete(category.delete);

/* ------------------------------------------------------- */
module.exports = router;
