// NPM imports
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();

// App Modules
const Post = require("../models/posts.model");
const auth = require("../middlewares/auth.middleware");

/************************* Converting Photo   ************************* */
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

/************************* Add A Post (Pic || text)   ************************* */
router.post("/posts/create", auth, upload.single("photo"), async (req, res) => {
  let post = new Post({ ...req.body, owner: req.user._id, creator: `${req.user.firstName} ${req.user.lastName}` });
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
});



// // Add A New Post (Only Text)
 router.post(
   "/post",
   auth,
   async (req, res) => {
     let post = new Post({ ...req.body, owner: req.user._id, creator: `${req.user.firstName} ${req.user.lastName}`});

     try {
       post.owner = req.user._id;
       await post.save();
       res.status(201).send(post);
     } catch (error) {
       res.status(400).send(error.message);
     }
   }
 );


/************************* Route For Getting All The Posts in DB   ************************* */
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



/************************* Route For Getting Single Posts in DB   ************************* */
router.get("/posts/:id",  auth ,async (req, res) => {
  try {
    let singlePost = await Post.find({_id: req.params.id});
    if (singlePost.length === 0) {
      return res.status(204).send({ message: "Error Editing the post" });
    }
    res.send(singlePost);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});


/************************* Route Getting the Users Posts   ************************* */
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

/************************* Route For Updating The User Post  ************************* */

router.patch("/posts/:id", auth, async (req, res) => {
  let updates = Object.keys(req.body);
  let valid = ["description"];
  let validUpdates = updates.every((update) => valid.includes(update));

  if (!validUpdates) {
    throw new Error("Invalid Updates");
  }

  try {
    let post = await Post.findById(req.params.id);;
    if (!post) {
      throw new Error("Invalid Updates");
    }

    updates.forEach((update) => (post[update] = req.body[update]));
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/************************* Route For Adding Comments And Count On Single Post  ************************* */

router.post("/posts/:id/comment", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      throw new Error("Invalid Operation");
    }

    post.comments.push({comment: req.body.comment, owner: req.body.id.toString(), name: req.body.name})
//    post.comment.owner = 
    await post.save();
    res.send("Comment Added Successfully");
  } catch (error) {
    res.status(400).send();
  }
});

/************************* Route For Like Count On Single Post  ************************* */

router.post("/posts/:id/like", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      throw new Error("Invalid Operation");
    }

    post.like = req.body.like
    await post.save();
    res.send("Successfully Liked The Post");
  } catch (error) {
    res.status(400).send();
  }
});

/************************* Deleting The User Post  ************************* */
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
