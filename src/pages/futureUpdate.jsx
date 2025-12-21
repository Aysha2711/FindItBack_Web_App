import React from "react";
import { Link } from "react-router-dom";
import "../styles/futureupdateCss.css";

const ComingSoon = () => {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-card">
        <h1>🚧 Coming Soon</h1>
        <p>
          This feature will be available in a future update.  
          We’re working hard to bring it to you!
        </p>
        <Link to="/user-dash" className="home-btn">Go Back Home</Link>
      </div>
    </div>
  );
};

export default ComingSoon;
