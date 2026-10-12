const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.expose && error.status) {
    return res.status(error.status).json({
      error: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    error: "Internal server error",
  });
};

module.exports = errorHandler;
