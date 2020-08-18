const mongoose = require("mongoose");
const multer = require("multer");

const photoSchema = mongoose.Schema(
  {
    description: {
      type: String,
      tirm: true,
      max: [250, "Description Too Long"],
    },
    photo: {
      type: Buffer,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamp: true,
  }
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
