const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: [500, "Please add post not a mini essay"],
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
