"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */

const token = require("../controllers/token");
const idValidation = require("../middlewares/idValidation");
const { isLoginAdmin } = require("../middlewares/permissions");

// URL: /tokens
router.use(isLoginAdmin);

router.route("/").get(token.list).post(token.create);
router.route("/:id").all(idValidation).get(token.read).delete(token.delete);

/* ------------------------------------------------------- */
module.exports = router;
