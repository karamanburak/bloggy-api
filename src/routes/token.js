"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */

const token = require("../controllers/token")
const permission = require("../middlewares/permissions")


// URL: /tokens

router.use(permission.isAdmin)

router.route("/").get(token.list).post(token.create)
router.route("/:id").get(token.read).put(token.update).patch(token.update).delete(token.delete)



/* ------------------------------------------------------- */
module.exports = router