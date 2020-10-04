const express = require("express");
const router = express.Router();
let User = require("../models/user.model");
const auth = require("../middlewares/auth.middleware");

//Route for sending the friend request
router.post("/users/:id/request", auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    req.user.friendRequestsSent.push({ owner: req.params.id });

    user.friendRequests.push({
      owner: req.user._id,
      friend: false,
      name: `${req.user.firstName} ${req.user.lastName}`,
    });
    await req.user.save();
    await user.save();
    res.send("Request Sent");
  } catch (error) {
    res.status(400).send(error.message);
  }
});


module.exports = router;
