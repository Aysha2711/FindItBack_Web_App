import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./../styles/loginpageCss.css";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import logoImage from "../assets/logo1.jpg";

const LoginPage = () => {

     const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-header">
        <img src={logoImage}  alt="Logo" className="logo" />
        <button className="close-btn" onClick={() => navigate("/")}>×</button>
      </div>

      <h2 className="login-title">LOGIN</h2>
    <div className="log">
      <div className="form-group">
        <input type="text" placeholder="Email or Username" />
        <input type="password" placeholder="Password" />
      </div>

      <div className="forgot-password">
        <a href="#">Forgot password ?</a>
    </div>
      <button className="login-btn" onClick={() => navigate("/user-dash")}>LOGIN</button>

      <div className="divider"></div>

      <div className="social-login">
        <FaGoogle className="social-icon google" />
        <FaFacebook className="social-icon facebook" />
        <FaApple className="social-icon apple" />
      </div>

      <p className="signup-text" onClick={() => navigate("/signup")}>
        Don’t have an account ? <a href="#">Sign up</a>
      </p>
      </div>
    </div>
  );
};

export default LoginPage;
