// NPM Packages
const express = require("express");
const router = express.Router();

// Model Imports
const Photo = require("../models/photo.model");
const Post = require("../models/posts.model");
const auth = require("../middlewares/auth.middleware");

router.get("/all", auth, async (req, res) => {
  try {
    let posts = await Post.find({});
    let photos = await Photo.find({});

    res.send(posts, photos);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


function sortArrays(arrays, comparator = (a, b) => (a < b) ? -1 : (a > b) ? 1 : 0) {
 let arrayKeys = Object.keys(arrays);
 let sortableArray = Object.values(arrays)[0];
 let indexes = Object.keys(sortableArray);
 let sortedIndexes = indexes.sort((a, b) => comparator(sortableArray[a], sortableArray[b]));

 let sortByIndexes = (array, sortedIndexes) => sortedIndexes.map(sortedIndex => array[sortedIndex]);

 if (Array.isArray(arrays)) {
     return arrayKeys.map(arrayIndex => sortByIndexes(arrays[arrayIndex], sortedIndexes));
 } else {
     let sortedArrays = {};
     arrayKeys.forEach((arrayKey) => {
         sortedArrays[arrayKey] = sortByIndexes(arrays[arrayKey], sortedIndexes);
     });
     return sortedArrays;
 }
}

module.exports = router;
