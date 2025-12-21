import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/successfulmsgCss.css";
import logo from "../assets/logo1.jpg";
import { FaCheck } from "react-icons/fa";

const SuccessfullMsg = () => {

    const navigate = useNavigate();

  return (
    <div className="signup-container">

      <div className="signup-header">
        <img src={logo} alt="Logo" className="logo" />
        <button className="close-btn" onClick={() => navigate("/user-dash")}>×</button>
      </div>

      <div className="success-page">
      <div className="reject-card">
        
        <div className="reject-icon">
          <FaCheck/>
        </div>
        <h2>Rejected!</h2>
        
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

export default SuccessfullMsg;



