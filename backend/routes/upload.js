const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { authMiddleware } = require("../middleware/auth");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Upload single image
router.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const imageType = req.body.type || "property"; // 'property' or 'panorama'
      const folder =
        imageType === "panorama" ? "ResiDo/panoramas" : "ResiDo/properties";

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: "image",
            transformation:
              imageType === "panorama"
                ? []
                : [
                    { width: 1200, height: 800, crop: "limit" },
                    { quality: "auto:good" },
                  ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(req.file.buffer);
      });

      res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        type: imageType,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res
        .status(500)
        .json({ error: "Failed to upload image", details: error.message });
    }
  },
);

// Upload multiple images
router.post(
  "/images",
  authMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No image files provided" });
      }

      const imageType = req.body.type || "property";
      const folder =
        imageType === "panorama" ? "ResiDo/panoramas" : "ResiDo/properties";

      // Upload all images to Cloudinary
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: folder,
              resource_type: "image",
              transformation:
                imageType === "panorama"
                  ? []
                  : [
                      { width: 1200, height: 800, crop: "limit" },
                      { quality: "auto:good" },
                    ],
            },
            (error, result) => {
              if (error) reject(error);
              else
                resolve({
                  url: result.secure_url,
                  publicId: result.public_id,
                  width: result.width,
                  height: result.height,
                  format: result.format,
                  type: imageType,
                });
            },
          );
          uploadStream.end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);

      res.json({
        success: true,
        images: results,
        count: results.length,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res
        .status(500)
        .json({ error: "Failed to upload images", details: error.message });
    }
  },
);

// Delete image
router.delete("/image/:publicId", authMiddleware, async (req, res) => {
  try {
    const publicId = req.params.publicId;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      res.json({ success: true, message: "Image deleted successfully" });
    } else {
      res.status(400).json({ error: "Failed to delete image" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res
      .status(500)
      .json({ error: "Failed to delete image", details: error.message });
  }
});

module.exports = router;
