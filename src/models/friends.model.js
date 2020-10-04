const mongoose = require("mongoose");

const friendsSchema = mongoose.Schema({
  friendRequests: [
    {
      owner: String,
      name: String,
      friend: false,
    },
  ],
  friendRequestsSent: [
    {
      owner: String,
    },
  ],

  friendList: [
    {
      owner: String,
    },
  ],
});

let Friends = mongoose.model("Friends", friendsSchema);

module.exports = Friends;
