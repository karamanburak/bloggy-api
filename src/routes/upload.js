"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const router = require("express").Router();
const multer = require("multer");
/* ------------------------------------------------------- */

const uploadController = require("../controllers/upload");
const permission = require("../middlewares/permissions");

// Memory storage for Vercel Blob Store (needs buffer, not disk file)
const memoryStorage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// URL: /upload

// Upload single file to Vercel Blob Store
router
  .route("/")
  .post(permission.isLogin, memoryStorage.single("file"), uploadController.upload);

/* ------------------------------------------------------- */
module.exports = router;

