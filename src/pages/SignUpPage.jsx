import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/signuppageCss.css";
import logo from "../assets/logo1.jpg";

import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

const SignupPage = () => {

    const navigate = useNavigate();

  return (
    <div className="signup-container">

      <div className="signup-header">
        <img src={logo} alt="Logo" className="logo" />
        <button className="close-btn" onClick={() => navigate("/login")}>×</button>
      </div>

      <h2 className="signup-title">SIGN UP</h2>
      <p className="signup-subtitle">Create your account</p>

      <div className="form-group">
        <label>Full Name</label>
        <input type="text" placeholder="Enter your full name" />
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input type="email" placeholder="name@example.com" />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input type="password" placeholder="Create a password" />
        <small>Must be at least 8 characters</small>
      </div>

      <div className="form-group">
        <label>Re-enter Password</label>
        <input type="password" placeholder="Confirm your password" />
        
      </div>


      <button className="signup-btn" onClick={() => navigate("/login")}>SIGN UP</button>


      <div className="divider">
        <span>or continue with</span>
      </div>


      <div className="social-login">
        <FaGoogle className="social-icon google" />
        <FaFacebook className="social-icon facebook" />
        <FaApple className="social-icon apple" />
      </div>

     <footer className="signup-footer">
        <div className="signup-footer-links">
            <a href="/coming-soon">Terms of Service</a>
            <a href="/coming-soon">Privacy Policy</a>
            <a href="/coming-soon">Cookie Policy</a>
            <a href="/coming-soon">Help Center</a>
        </div>
        <p>© 2025 FindItBack. All Rights Reserved</p>
    </footer>
    </div>
  );
};

export default SignupPage;



