const { env } = require("../config/env");

function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ success: false, message: "Invalid JSON body." });
    return;
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
    res.status(400).json({ success: false, message: "Validation failed.", errors });
    return;
  }

  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: statusCode === 500 ? "Something went wrong on the server." : err.message,
  };

  if (err.errors) {
    payload.errors = err.errors;
  }

  if (env.nodeEnv !== "production" && statusCode === 500) {
    payload.debug = err.message;
  }

  res.status(statusCode).json(payload);
}

module.exports = { notFound, errorHandler };
