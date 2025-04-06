const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  avatarUrl: String,
  walletAddress: String,
  contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: "PullRequest" }],
});

module.exports = mongoose.model("User", UserSchema);
