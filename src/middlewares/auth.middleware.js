require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function auth(req, res, next) {
  try {
    let token = req.header("Authorization").replace("Bearer ", "");
    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findOne({ _id: decoded._id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res.status(400).send({ Error: "Please Authenticate" });
  }
}

module.exports = auth;
