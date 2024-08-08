"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const user = require("../controllers/user");
const idValidation = require("../middlewares/idValidation");
const permission = require("../middlewares/permissions");

const getModel = (req, res, next) => {
  req.model = User;
  next();
};

// URL: /users

//! First Way
router.route("/").get(permission.isLoginAdmin, user.list).post(user.create);
router
  .route("/:id")
  .all(idValidation)
  .get(getModel, permission.isAdminOrStaffOrOwn, user.read)
  .put(getModel, permission.isAdminOrStaffOrOwn, user.update)
  .patch(getModel, permission.isAdminOrStaffOrOwn, user.update)
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
