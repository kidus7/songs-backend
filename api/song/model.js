
// Mongoose
const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [2, "Title can not be less than 2 characters"],
      maxlength: [100, "Title can not be greater than 100 characters"],
    },
    artist: {
      type: String,
      required: [true, "Artist name is required"],
      minlength: [5, "Artist can not be less than 5 characters"],
    },
    album: {
      type: String
    },
    genre: {
      type: String
    }
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
    },
    timestamps: true,
  }
);

// add pagination plugin
songSchema.plugin(mongoosePaginate);

// Song model
const Song = mongoose.model("Song", songSchema);

// Export Song model
module.exports = Song;
