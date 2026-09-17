const errorHandler = (error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || 500;

  const isServerError = statusCode >= 500;

  res.status(statusCode).json({
    success: false,
    message: isServerError
      ? "Internal server error"
      : error.message || "Request failed",
    errors: isServerError ? [] : error.errors || [],
  });
};

export default errorHandler;
