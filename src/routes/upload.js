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
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images are allowed (JPEG, PNG, GIF, WEBP)"
        ),
        false
      );
    }
  },
});

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: true,
        message: "File too large. Maximum size is 10MB",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        error: true,
        message: `Unexpected field: ${err.field}. Please use 'file' as the field name for the file upload.`,
      });
    }
    return res.status(400).json({
      error: true,
      message: `Upload error: ${err.message}`,
    });
  }
  if (err) {
    return res.status(400).json({
      error: true,
      message: err.message || "File upload error",
    });
  }
  next();
};

// URL: /upload

// Upload single file to Vercel Blob Store
router
  .route("/")
  .post(
    permission.isLogin,
    memoryStorage.single("file"),
    handleMulterError,
    uploadController.upload
  );

/* ------------------------------------------------------- */
module.exports = router;

