const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.FAKE_BOOK, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
