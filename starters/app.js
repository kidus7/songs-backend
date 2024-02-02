
// Third party middlewares
// Express
const express = require("express");

// App
const app = express();

const AppError =  require('../api/errorHandler/appError');

// Cors
const cors = require("cors");

// Global Error Handler
const geh = require("../api/errorHandler");

// Song router
const songRouter = require("../api/song/router");

// Use Third party middlewares
// app.use(cors("maraki-backend.vercel.app"));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// welcome api
app.get('/', (req, res) => {
  res.send('Welcome to Test Songs API')
})

// Use routers
app.use("/api/song", songRouter);

// Handle URL which don't exist
app.use("*", (req, res, next) => {
  return next(
    new AppError(
      `Unknown URL - ${req.protocol}://${req.get("host")}${req.originalUrl}`, 404)
  );
});

// Use GEH
app.use(geh);

// Export App
module.exports = app;
