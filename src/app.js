const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const app = express();
const compression = require('compression')
require("dotenv").config();

app.use(cors());
const PORT = process.env.PORT;
app.use(express.json());

// Route Imports
app.use(compression())
const userRouter = require("./routers/user.router");
app.use(userRouter);
const postRouter = require("./routers/post.router");
app.use(postRouter);

app.listen(PORT, () => {
  console.log(`App live on port ${PORT}`);
});
