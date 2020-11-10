const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.FAKE_BOOK, {
  useUnifiedTopology: true,
  autoIndex: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
