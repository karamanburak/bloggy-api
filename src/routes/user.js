"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */

const user = require("../controllers/user")


// URL: /users

//! First Way
router.route("/").get(user.list).post(user.create)
router.route("/:id").get(user.read).put(user.update).patch(user.update).delete(user.delete)


// //! Second Way
// router.route('/(:id)')
//     .post(user.create)
//     .get(user.read)
//     .put(user.update)
//     .patch(user.update)
//     .delete(user.delete)


/* ------------------------------------------------------- */
module.exports = router