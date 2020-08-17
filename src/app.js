const express = require("express");
require("./db/mongoose");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.json());

// Route Imports
const userRouter = require("./routers/user.router");
app.use(userRouter);
const postRouter = require("./routers/post.router");
app.use(postRouter);

app.listen(PORT, () => {
  console.log(`App live on port ${PORT}`);
});
