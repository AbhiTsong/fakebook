// NPM module imports
const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");

// Custom Imports
const auth = require("../middlewares/auth.middleware");
const Photo = require("../models/photo.model");

// Get all the pic in the data base

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

router.post("/photo/create", auth, upload.single("photo"), async (req, res) => {
  let photo = new Photo(req.body);

  try {
    let buffer = await sharp(req.file.buffer)
      // .resize({ width: 500, height: 750 })
      .png()
      .toBuffer();

    photo.owner = req.user._id;
    photo.photo = buffer;

    await photo.save();
    res.status(201).send(buffer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route For Getting All The Photos Created By The User
router.get("/photo/mine", auth, async (req, res) => {
  try {
    let photo = await Photo.find({ owner: req.user._id });

    if (photo.length === 0) {
      return res.send({ Message: "You dont have any pic at the moment" });
    }

    res.set("Content-Type", "image/jpg");
    // res.send(photo.forEach((pic) => res.send(pic.photo)));
    res.send(photo);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// route for deletaing the photo
router.delete("/photo/:id", auth, async (req, res) => {
  try {
    let photo = await Photo.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    res.status(200).send(photo);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
