import { useEffect, useRef } from "react";
import HALO from "./vanta.halo.min";
import * as THREE from "three";
import "./LandingPage.css"; // Ensure you have this CSS file

const GitGains = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    const effect = HALO({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      baseColor: 0xfc,
      backgroundColor: 0x0,
      xOffset: -0.2,
      THREE, // Pass THREE instance
    });

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <div>
      {/* Vanta Background */}
      <div id="vanta-halo" ref={vantaRef}>
        <div className="intro">
          <h2 className="space-mono-bold">What is GitGains?</h2>
          <p id="introduction" className="big-shoulders-stencil-regular">
            GitGains is a decentralized application (dApp) that integrates with
            GitHub to reward contributors with APT tokens upon the successful
            merging of pull requests (PRs).
          </p>
          <button id="know-more">Know More</button>
        </div>
      </div>

      {/* Process Section */}
      <div className="process">
        <div className="github">
          <h2 className="space-mono-bold card">Github Integration</h2>
          <p className="space-mono-regular">
            Seamlessly connect with GitHub repositories and issues.
          </p>
          <img src="github-3.png" alt="GitHub Integration" className="img-size" />
        </div>
        <div className="streamline">
          <h2 className="space-mono-bold card">Streamlined Process</h2>
          <p className="space-mono-regular">
            Easy-to-use platform for creating, finding, claiming, and submitting
            bounties.
          </p>
          <img src="https://github.com/jaskeerat01/build-with-india/blob/jaskeerat/streamlined.jpg" alt="Streamlined Process" className="img-size" />
        </div>
      </div>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title space-mono-bold">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card" id="card-1">
              <div className="step-number">1</div>
              <h3 className="step-title space-mono-bold">Browse Issues</h3>
              <p className="step-description space-mono-regular">
                Explore available bounties from various open-source projects.
              </p>
            </div>
            <div className="step-card" id="card-2">
              <div className="step-number">2</div>
              <h3 className="step-title space-mono-bold">Claim & Solve</h3>
              <p className="step-description space-mono-regular">
                Claim a bounty and submit a link to your pull request.
              </p>
            </div>
            <div className="step-card" id="card-3">
              <div className="step-number">3</div>
              <h3 className="step-title space-mono-bold">Level Up</h3>
              <p className="step-description space-mono-regular">
                Build your reputation and unlock bigger opportunities.
              </p>
            </div>
            <div className="step-card" id="card-4">
              <div className="step-number">4</div>
              <h3 className="step-title space-mono-bold">Get Rewarded</h3>
              <p className="step-description space-mono-regular">
                Once accepted, unlock the reward and receive crypto payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer>
        <div className="footer">
          <div className="logo-links">
            <img src="logo.png" alt="Logo" className="logo-footer" />
            <div className="links">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div className="trademark">
            <p className="copyright">
              Made with 💙 by Bash Commando
              <br />
              Copyright ©2025, All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GitGains;
