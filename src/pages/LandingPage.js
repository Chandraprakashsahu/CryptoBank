import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const LandingPage = () => {
  return (
    <div className="page-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="landing-content">
        <h1 className="landing-title">
          Welcome to <span className="highlight">CryptoBank</span>
        </h1>
        <p className="landing-subtitle">
          The future of decentralized banking. Secure, transparent, and completely in your control.
        </p>
        <Link to="/app" className="launch-button">
          Launch App
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;