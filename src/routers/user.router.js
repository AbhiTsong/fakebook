const express = require("express");
const router = express.Router();
let User = require("../models/user.model");
const auth = require("../middlewares/auth.middleware");

// Signing Up A New User
router.post("/users/create", async (req, res) => {
  let user = new User(req.body);
  try {
    await user.save();
    let token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Logging In A User
router.post("/users/login", async (req, res) => {
  try {
    let user = await User.authenticateUser(req.body.email, req.body.password);
    let token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Logging Out The User (From Current Device)
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send({Message: "Logged Out From The Current Device."});
  } catch (error) {
    res.status(400).send();
  }
});

// Logging Out The User From All Devices
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ Message: "Logged Out From All The Devices" });
  } catch (error) {
    res.status(400).send();
  }
});

// Getting The Users Profile
router.get("/users/me", auth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Updating The User Profile
router.patch("/users/me", auth, async (req, res) => {
  let updates = Object.keys(req.body);
  let validUpdates = ["firstName", "lastName", "password", "dateOfBirth"];
  let isValid = updates.every((update) => validUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send("Invalid updates provided");
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Deleteing THe User
router.delete("/users/me", auth, async (req, res) => {
  try {
    req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(403).send();
  }
});

module.exports = router;
