const express = require("express");
const router = express.Router();
const Bounty = require("../models/Bounty");
const Submission = require("../models/Submission");

// ✅ POST: Create Bounty by Company
router.post("/create", async (req, res) => {
    const { title, description, reward, company, deadline, githubLink } = req.body;
  
    try {
      const bounty = new Bounty({
        title,
        description,
        reward,
        company,
        deadline,
        githubLink, // ✅ Include GitHub Link
      });
  
      await bounty.save();
      res.status(201).json({ success: true, message: "Bounty created successfully", bounty });
    } catch (err) {
      res.status(500).send({ success: false, error: err.message });
    }
  });

// ✅ GET: List All Open Bounties
router.get("/", async (req, res) => {
  try {
    const bounties = await Bounty.find({ status: "open" });
    res.status(200).json({ success: true, bounties });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// ✅ POST: Submit Bounty Solution
router.post("/submit", async (req, res) => {
  const { bountyId, developer, submissionLink } = req.body;
  try {
    const submission = new Submission({ bounty: bountyId, developer, submissionLink });
    await submission.save();
    res.status(201).json({ success: true, message: "Submission received", submission });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// ✅ POST: Review Submission
router.post("/review", async (req, res) => {
  const { submissionId, status } = req.body;
  try {
    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });

    submission.status = status;
    await submission.save();

    if (status === "approved") {
      // Close the bounty once approved
      await Bounty.findByIdAndUpdate(submission.bounty, { status: "closed" });
    }

    res.status(200).json({ success: true, message: `Submission ${status}` });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

module.exports = router;
