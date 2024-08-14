"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const user = require("../controllers/user");
const User = require("../models/user");
const idValidation = require("../middlewares/idValidation");
const permission = require("../middlewares/permissions");

const getModel = (req, res, next) => {
  req.model = User;
  next();
};

// URL: /users

//! First Way
router
  .route("/")
  .get(permission.isUserOwnerOrAdmin, user.list)
  .post(user.create);
router
  .route("/:id")
  .all(idValidation)
  .get(getModel, permission.isUserOwnerOrAdmin, user.read)
  .put(getModel, permission.isUserOwnerOrAdmin, user.update)
  .patch(getModel, permission.isUserOwnerOrAdmin, user.update)
  .delete(permission.isLoginAdmin, user.delete);

// //! Second Way
// router.route('/(:id)')
//     .post(user.create)
//     .get(user.read)
//     .put(user.update)
//     .patch(user.update)
//     .delete(user.delete)

/* ------------------------------------------------------- */
module.exports = router;
