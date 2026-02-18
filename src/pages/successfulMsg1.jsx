import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/successfulmsgCss.css";
import logo from "../assets/logo1.jpg";
import { FaCheck } from "react-icons/fa";

const SuccessfullMsg1 = () => {

    const navigate = useNavigate();

  return (
    <div className="signup-container">

      <div className="signup-header">
        <img src={logo} alt="Logo" className="logo" />
        <button className="close-btn" onClick={() => navigate("/")}>×</button>
      </div>

      <div className="success-page">
      <div className="success-card">
        
        <div className="success-icon">
          <FaCheck />
        </div>
        <h2>Success!</h2>
        <p>Thank you! Your submission has been received.</p>
      </div>
    </div>

   

     <footer className="signup-footer">
        <div className="signup-footer-links">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Help Center</a>
        </div>
        <p>© 2025 FindItBack. All Rights Reserved</p>
    </footer>
    </div>
  );
};

export default SuccessfullMsg1;



