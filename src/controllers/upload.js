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
      // Check if file exists (multer handles the file upload)
      if (!req.file) {
        return res.status(400).json({
          error: true,
          message: "No file provided",
        });
      }

      // Convert file buffer to upload to Vercel Blob Store
      const file = req.file;
      const fileName = file.originalname || `image-${Date.now()}.jpg`;

      // Upload to Vercel Blob Store
      const blob = await put(fileName, file.buffer, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN, // Set this in environment variables
        contentType: file.mimetype,
      });

      // Return the URL
      return res.status(200).json({
        error: false,
        message: "File uploaded successfully",
        url: blob.url,
        success: true,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({
        error: true,
        message: "Failed to upload image",
        details: error.message,
      });
    }
  },
};

