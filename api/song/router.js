
// Express
const express = require("express");

// Router
const router = express.Router();

// Song controller
const songController = require("./controller");

// validation
const { body } = require('express-validator');

router.get("/stats", songController.getStats)

router
  .route("/")
  .post(
  [
    body('title').isString().withMessage('Title is Required'),
    body('artist').isString().withMessage('Artist name is Required'),
    body('album').isString().withMessage('Album should be a string'),
    body('genre').isString().withMessage('Genre should be a string'),
  ],  
    songController.createSong)
  .get(songController.getAllSongs)

router
  .route("/:id")
  .get(songController.getSingleSong)
  .patch(
    [
        body('title').isString().withMessage('Title is Required'),
        body('artist').isString().withMessage('Artist name is Required'),
        body('album').isString().withMessage('Album should be a string'),
        body('genre').isString().withMessage('Genre should be a string'),
    ], 
  songController.updateSong)
  .delete(
    songController.deleteSingleSong
  );

// Export router
module.exports = router;
