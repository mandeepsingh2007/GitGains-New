import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LandingPage.css";
import * as THREE from "three";
import RINGS from "./vanta.rings.min";
import GitGains from "./GitGains";

const GITHUB_CLIENT_ID = "Ov23liLqgLGKcy7FnwDi"; // Replace with your GitHub OAuth Client ID
const BACKEND_URL = "http://localhost:5000"; // Update if deployed

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const vantaEffect = RINGS({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      backgroundColor: 0x0,
      THREE,
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);



  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/user`, { withCredentials: true });
        setUser(response.data);
        if (response.data) navigate("http://localhost:3000/create-bounty");
      } catch (error) {
        console.log("Not logged in.");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleGitHubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user`;
  };


  return (
    <div id="vanta-bg">
      <div className="navbar blur-background">
        <div id="logo-contain">
          <img src="http://localhost:3000/logo.png" id="logo" />
        </div>
        <button id="login" className="nav-btn" onClick={handleGitHubLogin}>Login with Github</button>
      </div>
      <div className="hero">
        <p className="rewards press-start-2p-regular">
          Blockchain-based Rewards for Developer Contributions
        </p>
        <p className="earn">Earn Sepolia ETH Tokens on Solving Github Issues</p>
      </div>
      <GitGains />
    </div>
  );

};

export default LandingPage;