const mongoose = require("mongoose");

const PullRequestSchema = new mongoose.Schema({
  repoName: String,
  prId: Number,
  status: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: Date,
  mergedAt: Date,
});

module.exports = mongoose.model("PullRequest", PullRequestSchema);
