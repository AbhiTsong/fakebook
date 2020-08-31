// NPM imports
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();

// App Modules
const Post = require("../models/posts.model");
const auth = require("../middlewares/auth.middleware");

// Adding Photo
let upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error(`Only .jpg .jpeg .png file type supported`));
    }
    cb(null, true);
  },
});

// Add A Post Only Post
router.post("/posts/create", auth, async (req, res) => {
  let post = new Post({ ...req.body, owner: req.user._id });
  try {
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Add A New Post With Photo
router.post(
  "/posts/photo/create",
  auth,
  upload.single("photo"),
  async (req, res) => {
    let post = new Post({ ...req.body, owner: req.user._id });
    try {
      let buffer;
      if (req.file.buffer !== undefined) {
        buffer = await sharp(req.file.buffer)
          // .resize({ width: 500, height: 750 })
          .png()
          .toBuffer();
      }

      post.owner = req.user._id;
      post.photo = buffer ? buffer : null;

      await post.save();
      res.status(201).send(post);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

// Route For Getting All The Posts in DB
router.get("/posts", auth, async (req, res) => {
  try {
    let allPosts = await Post.find({});
    if (allPosts.length === 0) {
      return res.status(204).send({ message: "There Are No Posts" });
    }
    res.send(allPosts);
  } catch (error) {
    return res.status(400).send(error.message);
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

// Deleting The User Post
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    let post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      throw new Error();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
