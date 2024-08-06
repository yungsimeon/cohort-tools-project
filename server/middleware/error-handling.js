function errorHandler(err, req, res, next) {
  console.error("Error", req.method, req.path, err);

  if (!res.headersSent) {
    res
      .status(500)
      .json({ message: "internal Server error, check the console" });
  }
}

function notFoundHandler(req, res, next) {
  res.status(404).json({ message: "Route not found" });
}

module.exports = { errorHandler, notFoundHandler };
