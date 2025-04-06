const mongoose = require("mongoose");

const bountySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "open",
  },
  githubLink: {
    type: String,
    required: false, // Not mandatory
  },
});

const Bounty = mongoose.model("Bounty", bountySchema);

module.exports = Bounty;
