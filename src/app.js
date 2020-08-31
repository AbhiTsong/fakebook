const express = require("express");
const cors  =  require("cors");
require("./db/mongoose");
const app = express();
require("dotenv").config();



app.use(cors())
const PORT = process.env.PORT;
app.use(express.json());

// Route Imports
const homeRouter = require("./routers/post.photo.route");
app.use(homeRouter);
const userRouter = require("./routers/user.router");
app.use(userRouter);
const postRouter = require("./routers/post.router");
app.use(postRouter);
const photoRouter = require("./routers/photo.router");
app.use(photoRouter);

app.listen(PORT, () => {
  console.log(`App live on port ${PORT}`);
});
