const express = require("express");
const PullRequest = require("../models/pullRequest");
const router = express.Router();

router.post("/webhook", async (req, res) => {
    const { action, pull_request, repository } = req.body;

    if (action === "closed" && pull_request.merged) {
        await PullRequest.create({
            repoName: repository.full_name,
            prId: pull_request.id,
            status: "merged",
            user: pull_request.user.id,
            mergedAt: pull_request.merged_at,
        });
    }

    res.sendStatus(200);
});

router.get("/leaderboard", async (req, res) => {
    try {
        const users = await User.find().populate("contributions");
        const leaderboard = users
            .map(user => ({
                username: user.username,
                avatarUrl: user.avatarUrl,
                mergedPRs: user.contributions.length,
            }))
            .sort((a, b) => b.mergedPRs - a.mergedPRs);
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/webhook", async (req, res) => {
    const { action, pull_request, repository } = req.body;
  
    if (action === "closed" && pull_request.merged) {
      const user = await User.findOne({ githubId: pull_request.user.id });
      if (user) {
        const pr = await PullRequest.create({
          repoName: repository.full_name,
          prId: pull_request.id,
          status: "merged",
          user: user._id,
          mergedAt: pull_request.merged_at,
        });
        user.contributions.push(pr._id);
        await user.save();
      }
    }
  
    res.sendStatus(200);
  });
  
module.exports = router;
