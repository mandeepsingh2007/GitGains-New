import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BountyList.css";
import { useNavigate } from "react-router-dom"; // If using React Router

const BountyList = () => {
  const [bounties, setBounties] = useState([]);
  const [active, setActive] = useState(0);
  const navigate = useNavigate(); // Only works if you use react-router-dom v6+

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bounties");
        setBounties(res.data.bounties);
      } catch (error) {
        console.error("Error fetching bounties:", error);
      }
    };

    fetchBounties();
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll(".slider .item");

    items.forEach((item, index) => {
      const stt = index - active;

      if (index === active) {
        item.style.transform = "translateX(0) scale(1)";
        item.style.zIndex = 10;
        item.style.opacity = 1;
        item.style.filter = "none";
      } else if (index < active) {
        item.style.transform = `translateX(${-120 * Math.abs(stt)}px) scale(${1 - 0.2 * Math.abs(stt)}) perspective(1000px) rotateY(8deg)`;
        item.style.zIndex = 5 - Math.abs(stt);
        item.style.opacity = Math.abs(stt) > 2 ? 0 : 0.6;
        item.style.filter = "blur(3px)";
      } else {
        item.style.transform = `translateX(${120 * Math.abs(stt)}px) scale(${1 - 0.2 * Math.abs(stt)}) perspective(1000px) rotateY(-8deg)`;
        item.style.zIndex = 5 - Math.abs(stt);
        item.style.opacity = Math.abs(stt) > 2 ? 0 : 0.6;
        item.style.filter = "blur(3px)";
      }
    });
  }, [active, bounties]);

  const next = () => {
    if (active < bounties.length - 1) setActive(active + 1);
  };

  const prev = () => {
    if (active > 0) setActive(active - 1);
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard"); // update route if different
  };

  const handleCodeReview = () => {
    navigate("/ai-suggestions"); // update route if different
  };

  return (
    <div className="main-container">
      <h2 className="title">🔥 Open Bounties</h2>

      <div className="slider">
        {bounties.length === 0 ? (
          <p className="text-gray-300">No open bounties available.</p>
        ) : (
          <>
            {bounties.map((bounty, idx) => (
              <div key={bounty._id} className="item dark-card">
                <h3 className="bounty-title">{bounty.title}</h3>
                <p className="bounty-desc">{bounty.description}</p>
                <p className="reward">💰 Reward: {bounty.reward} ETH</p>
                <p className="company">🏢 Company: {bounty.company}</p>
                <p className="deadline">
                  📅 {new Date(bounty.deadline).toLocaleDateString()}
                </p>
                {bounty.githubLink && (
                  <a
                    href={bounty.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                  >
                    View GitHub Repo
                  </a>
                )}
              </div>
            ))}
            <button id="prev" onClick={prev}>
              &#60;
            </button>
            <button id="next" onClick={next}>
              &#62;
            </button>
          </>
        )}
      </div>

      {/* 👇 New Buttons */}
      <div className="extra-buttons">
        <button className="btn-secondary" onClick={handleLeaderboard}>
          🏆 Go to Leaderboard
        </button>
        <button className="btn-secondary" onClick={handleCodeReview}>
          🤖 AI Code Review
        </button>
      </div>
    </div>
  );
};

export default BountyList;
