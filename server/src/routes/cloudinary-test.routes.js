import express from "express";

import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();

    res.status(200).json({
      success: true,
      message: "Cloudinary authentication successful",
      data: result,
    });
  } catch (error) {
    console.error("Cloudinary ping error:", {
      message: error.message,
      httpCode: error.http_code,
      name: error.name,
    });

    res.status(error.http_code || 500).json({
      success: false,
      message: error.message,
      httpCode: error.http_code || 500,
    });
  }
});

export default router;
