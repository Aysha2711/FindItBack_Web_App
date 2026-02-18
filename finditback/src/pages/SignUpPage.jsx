import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/signuppageCss.css";
import logo from "../assets/logo1.jpg";
import { useFeedback } from "../context/FeedbackContext";

import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

const SignupPage = () => {

  const navigate = useNavigate();
  const { notify } = useFeedback();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      notify("Passwords do not match");
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        notify("Registration Successful");
        navigate("/login");
      } else {
        notify(data.message);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      notify("Error signing up");
    }
  };

  return (
    <div className="signup-container">
      <div>
        <div className="signup-header">
          <img src={logo} alt="Logo" className="logo" />
          <button className="close-btn" onClick={() => navigate("/login")}>×</button>
        </div>

        <h2 className="signup-title">SIGN UP</h2>
        <p className="signup-subtitle">Create your account</p>

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" placeholder="Enter your full name" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="name@example.com" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" placeholder="Enter your phone number" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="Create a password" onChange={handleChange} />
          <small>Must be at least 8 characters</small>
        </div>

        <div className="form-group">
          <label>Re-enter Password</label>
          <input type="password" name="confirmPassword" placeholder="Confirm your password" onChange={handleChange} />
        </div>

        <button className="signup-btn" onClick={handleSubmit}>SIGN UP</button>

        {/* <div className="divider">
          <span>or continue with</span>
        </div> */}

        {/* <div className="social-login">
          <FaGoogle className="social-icon google" />
          <FaFacebook className="social-icon facebook" />
          <FaApple className="social-icon apple" />
        </div> */}

        {/* <footer className="signup-footer">
          <div className="signup-footer-links">
            <a href="/coming-soon">Terms of Service</a>
            <a href="/coming-soon">Privacy Policy</a>
            <a href="/coming-soon">Cookie Policy</a>
            <a href="/coming-soon">Help Center</a>
          </div>
          <p>© 2025 FindItBack. All Rights Reserved</p>
        </footer> */}
      </div>
    </div>
  );
};

export default SignupPage;





