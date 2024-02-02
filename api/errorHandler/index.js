const AppError =  require('../errorHandler/appError');

const sendError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errorStack: err.stack,
  });
};

// Global Error Handler
const geh = (err, req, res, next) => {
  err.status = err.status || "ERROR";
  err.statusCode = err.statusCode || 500;

  // Duplicate data error
  // if (err.code === 11000) {
  //   if (err.message.includes("title")) {
  //     err = new Error("Song Title is already used.");
  //   }
  // }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(" || ");
    err = new AppError(message, 404);
  }

  // Casting error
  if (err.name === "CastError") {
    const message = `Resource not found`;
    err = new AppError(message, 404);
  }
  sendError(err, res)

};

// Export GEH
module.exports = geh;
