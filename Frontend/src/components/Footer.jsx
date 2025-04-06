import "./LandingPage.css";
const Footer = () => {
    return (
      <footer>
        <div className="footer">
          <div className="logo-links">
            <img src="logo.png" className="logo-footer" alt="Logo" />
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
    );
  };
  
  export default Footer;
  