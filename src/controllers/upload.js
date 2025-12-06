"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const { put } = require("@vercel/blob");

module.exports = {
  upload: async (req, res) => {
    /*
        #swagger.tags = ["Upload"]
        #swagger.summary = "Upload Image to Vercel Blob Store"
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['file'] = {
            in: 'formData',
            type: 'file',
            required: true,
            description: 'Image file to upload'
        }
    */

    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      // Check if BLOB_READ_WRITE_TOKEN is configured
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error("BLOB_READ_WRITE_TOKEN is not configured");
        return res.status(500).json({
          error: true,
          message: "Server configuration error: BLOB_READ_WRITE_TOKEN is missing",
        });
      }

      // Check if file exists (multer handles the file upload)
      if (!req.file) {
        return res.status(400).json({
          error: true,
          message: "No file provided",
        });
      }

      // Validate file type (images only)
      const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          error: true,
          message: "Invalid file type. Only images are allowed (JPEG, PNG, GIF, WEBP)",
        });
      }

      // Convert file buffer to upload to Vercel Blob Store
      const file = req.file;
      
      // Generate unique filename to prevent conflicts
      // Format: timestamp-randomstring-originalname
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const originalName = file.originalname || "image.jpg";
      // Clean original name (remove special characters, keep extension)
      const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileExtension = cleanName.split(".").pop() || "jpg";
      const baseName = cleanName.replace(/\.[^/.]+$/, "") || "image";
      
      // Create unique filename: timestamp-random-baseName.extension
      const fileName = `${timestamp}-${randomString}-${baseName}.${fileExtension}`;

      console.log("Uploading file:", {
        originalName: file.originalname,
        fileName,
        size: file.size,
        mimetype: file.mimetype,
      });

      // Upload to Vercel Blob Store
      const blob = await put(fileName, file.buffer, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: file.mimetype,
      });

      console.log("File uploaded successfully:", blob.url);

      // Return the URL
      return res.status(200).json({
        error: false,
        message: "File uploaded successfully",
        url: blob.url,
        success: true,
      });
    } catch (error) {
      console.error("Upload error:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      return res.status(500).json({
        error: true,
        message: "Failed to upload image. Please try again.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

