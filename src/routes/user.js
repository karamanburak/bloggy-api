"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const user = require("../controllers/user");
const idValidation = require("../middlewares/idValidation");
const permission = require("../middlewares/permissions");

// URL: /users

//! First Way
router
  .route("/")
  .get(permission.isUserOwnerOrAdmin, user.list)
  .post(user.create);
router
  .route("/:id")
  .all(idValidation, permission.isUserOwnerOrAdmin)
  .get(user.read)
  .put(user.update)
  .patch(user.update)
  .delete(user.delete);

// //! Second Way
// router.route('/(:id)')
//     .post(user.create)
//     .get(user.read)
//     .put(user.update)
//     .patch(user.update)
//     .delete(user.delete)

/* ------------------------------------------------------- */
module.exports = router;
