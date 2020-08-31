const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      default: null,
      maxlength: [500, "Please add post not a mini essay"],
    },
    photo: {
      type: Buffer,
      default: null
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Post = mongoose.model("Post", postSchema);

module.exports = Post;
