import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Leaderboard from "./components/Leaderboard";
import LandingPage from "./components/LandingPage";
import AISuggestions from "./components/AISuggestions";
import BountyList from "./components/BountyList";
import CreateBounty from "./components/CreateBounty";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/ai-suggestions" element={<AISuggestions />} />
          <Route path="/bounty-list" element={<BountyList />} />
          <Route path="/create-bounty" element={<CreateBounty />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
