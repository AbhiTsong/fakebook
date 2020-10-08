const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { use } = require("../routers/user.routers");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!value.toLowerCase().match(validEmail)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      min: [7, "Password should at least have 7 characters"],
    },
    dateOfBirth: {
      date: {
        type: Number,
        required: true,
        validate(value) {
          if (value < 1 || value > 31) {
            throw new Error(`${value} is not a valid date`);
          }
        },
      },
      month: {
        type: String,
        required: true,
        validate(value) {
          let allMOnths = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          if (!allMOnths.includes(value)) {
            throw new Error("Invalid Month Provided");
          }
        },
      },
      year: {
        type: Number,
        required: true,
        min: [
          new Date().getFullYear() - 100,
          "You Seems To Be Too Old To Use Fakebook",
        ],
        max: [
          new Date().getFullYear(),
          "Currently Fakebook is not accepting people from the future",
        ],
      },
    },
    gender: {
      type: String,
      default: null,
      lowercase: true,
      validate(value) {
        let validGenders = ["male", "female", "others"];
        if (!validGenders.includes(value))
          throw new Error("Invalid Gender Provided");
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],

    avatar: {
      type: Buffer,
      default: null,
    },

    cover: {
      type: Buffer,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

//Deleting the sensetive data defore it is being to the user

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  delete userObject.cover;
  delete userObject.gender;
  return userObject;
};

// virtual for linking post to the user who created it
userSchema.virtual("photo", {
  ref: "Photo",
  localField: "_id",
  foreignField: "owner",
});

// virtual for linking post to the user who created it
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "owner",
});

// Middleware for authenticating the user
userSchema.statics.authenticateUser = async function (email, password) {
  let user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable To Login");
  }

  let validUser = await bcrypt.compare(password, user.password);

  if (!validUser) {
    throw new Error("Unable To Login");
  }

  return user;
};

// Middleware for generating the auth token
userSchema.methods.generateAuthToken = async function () {
  let user = this;
  let token = await jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: "1 Day",
    }
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Middleware For Hashing the Password
userSchema.pre("save", async function (next) {
  let user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

let User = mongoose.model("User", userSchema);

module.exports = User;
