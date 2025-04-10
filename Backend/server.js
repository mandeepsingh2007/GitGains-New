const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const bountyRoutes = require("./routes/bountyRoutes");
const { ethers } = require("ethers");
const OpenAI = require("openai");
const axios = require("axios");



dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();

// 🔹 Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(session({ secret: "your_secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/bounties", bountyRoutes);

// 🔹 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/github_contributions", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 🔹 Define Schemas
const PullRequest = mongoose.model("PullRequest", new mongoose.Schema({
  prId: Number,
  title: String,
  url: String,
  user: String,
  state: String,
  merged: Boolean,
  createdAt: Date,
}));

const Leaderboard = mongoose.model("Leaderboard", new mongoose.Schema({
  username: String,
  contributions: Number,
}));

const User = mongoose.model("User", new mongoose.Schema({
  githubId: String,
  username: String,
  avatar: String,
}));

// 🔹 GitHub OAuth Setup
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOneAndUpdate(
        { githubId: profile.id },
        { username: profile.username, avatar: profile.photos[0].value },
        { upsert: true, new: true }
      );
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// 🔹 GitHub OAuth Routes
app.get("/api/auth/github", passport.authenticate("github", { scope: ["user"] }));

app.get("/api/auth/github/callback", passport.authenticate("github", {
  failureRedirect: "/",
  successRedirect: "http://localhost:3000/leaderboard",
}));

app.get("/api/auth/user", (req, res) => {
  if (req.isAuthenticated()) return res.json(req.user);
  res.status(401).json({ message: "Not authenticated" });
});

app.get("/api/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000/");
  });
});

// 🔹 Webhook Route (Counts Only Merged PRs)

// Add your environment variables
const INFURA_SEPOLIA_URL = process.env.INFURA_SEPOLIA_URL; // Sepolia endpoint
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Private key of 0x0fEb...

// Set up provider and signer
const provider = new ethers.JsonRpcProvider(INFURA_SEPOLIA_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const receiver = "0x0fEb783623448bb6baed90b93455e30123e896C8"; // Developer wallet

// Init Function Network AI client
const client = new OpenAI({
  apiKey: process.env.FXN_API_KEY,
  baseURL: 'https://api.function.network/v1',
});

app.post("/api/contributions/webhook", async (req, res) => {
  try {
    const { action, pull_request } = req.body;
    if (!pull_request) return res.status(400).json({ message: "Invalid payload" });

    const { id, title, html_url, user, state, merged_at, created_at, url: prUrl } = pull_request;
    const username = user.login;

    if (!state) {
      console.log(`❌ PR #${id} not merged.`);
      return res.status(200).json({ message: "PR not merged" });
    }

    // Step 1: Fetch PR diff
    const diffRes = await axios.get(`${prUrl}.diff`, {
      headers: {
        Accept: "application/vnd.github.v3.diff"
      },
      responseType: "text"
    });

    const prDiff = typeof diffRes.data === "string" ? diffRes.data : String(diffRes.data);
    // Step 2: Fetch bounty info from your DB (mocked for now)
    const bounty = {
      title: "Implement User Profile Page with Editable Information",
      description: "Enhance the ChatMingle application by adding a user profile page that allows users to view and update their personal information.",
      githubLink: "https://github.com/mandeepsingh2007/ChatMingle",
      reward: "0.01",
    };

    // Step 3: Ask AI to verify if PR solves bounty
    const aiResponse = await client.chat.completions.create({
      model: 'meta/llama-3.1-70b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that verifies if a GitHub pull request solves a specific issue described in a bounty.',
        },
        {
          role: 'user',
          content: `Here is the bounty:\nTitle: ${bounty.title}\nDescription: ${bounty.description}`,
        },
        {
          role: 'user',
          content: `Here is the PR code diff:\n${prDiff}`,
        },
        {
          role: 'user',
          content: `Does this PR fully and correctly implement the bounty? Respond with "yes" or "no" and a short reason.`,
        },
      ],
    });

    const aiAnswer = aiResponse.choices[0].message.content.trim().toLowerCase();
    console.log(`🤖 AI Response: ${aiAnswer}`);

    const isApproved = aiAnswer.includes("yes");

    if (isApproved) {
      // ✅ Update DB records
      await PullRequest.findOneAndUpdate(
        { prId: id },
        {
          prId: id,
          title,
          url: html_url,
          user: username,
          state,
          merged: true,
          createdAt: created_at,
        },
        { upsert: true, new: true }
      );

      await Leaderboard.findOneAndUpdate(
        { username },
        { $inc: { contributions: 1 } },
        { upsert: true, new: true }
      );

      // 💸 Send ETH reward
      const tx = await signer.sendTransaction({
        to: receiver,
        value: ethers.parseEther("0.01"),
      });

      await tx.wait();
      console.log(`🚀 Sent 0.01 Sepolia ETH to ${receiver}. Tx Hash: ${tx.hash}`);
    } else {
      console.log(`❌ PR #${id} did not pass AI verification. No ETH sent.`);
    }

    res.status(200).json({ message: "Webhook processed" });
  } catch (error) {
    console.error("🚨 Error processing webhook:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use(cors());
app.use(express.json());


app.post("/api/ai-suggestions", async (req, res) => {
  try {
    const { codeSnippet } = req.body;

    if (!codeSnippet) {
      return res.status(400).json({ error: "Code snippet is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze the following code and provide improvement suggestions.
    Return only the suggested changes and line numbers where they should be applied, without modifying the rest of the code.

    Code:
    ${codeSnippet}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const suggestions = result.response.text();

    res.json({ success: true, suggestions });
  } catch (error) {
    console.error("🚨 AI Suggestion Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});




// 🔹 Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
