const express = require("express");
const Post = require("../models/posts.model");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();

// Add A New Post
router.post("/post/create", auth, async (req, res) => {
  let post = new Post({ ...req.body, owner: req.user._id });
  try {
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Route Getting the Users Posts
router.get("/posts/allPosts", auth, async (req, res) => {
  try {
    let userPosts = await Post.find({ owner: req.user._id });
    if (userPosts.length === 0) {
      return res.send({ message: "You Dont Have Any Posts At The Moment" });
    }

    res.send(userPosts);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route For Updating The User Post
router.patch("/posts/:id", auth, async (req, res) => {
  let updates = Object.keys(req.body);
  let valid = ["description"];
  let validUpdates = updates.every((update) => valid.includes(update));

  if (!validUpdates) {
    throw new Error("Invalid Updates");
  }

  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      throw new Error("Invalid Updates");
    }

    updates.forEach((update) => (post[update] = req.body[update]));
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
