import multer from "multer";

const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Profile photo must be smaller than 5 MB"
        : error.code === "LIMIT_FILE_COUNT"
          ? "Only one profile photo can be uploaded"
          : "File upload failed";

    return res.status(400).json({
      success: false,
      message,
      errors: [],
    });
  }

  if (error?.message === "Only JPG, PNG, and WebP images are allowed") {
    return res.status(400).json({
      success: false,
      message: error.message,
      errors: [],
    });
  }

  const statusCode = error.statusCode || 500;
  const isServerError = statusCode >= 500;

  return res.status(statusCode).json({
    success: false,
    message: isServerError
      ? "Internal server error"
      : error.message || "Request failed",
    errors: isServerError ? [] : error.errors || [],
  });
};

export default errorHandler;
