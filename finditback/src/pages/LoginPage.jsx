import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/loginpageCss.css";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import logoImage from "../assets/logo1.jpg";
import { useFeedback } from "../context/FeedbackContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { notify } = useFeedback();
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // First try User login
      const userResponse = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const userData = await userResponse.json();

      if (userResponse.ok) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.removeItem('isAdminLoggedIn');
        sessionStorage.removeItem('isAdminMode');
        sessionStorage.removeItem('adminToken');
        sessionStorage.setItem('userId', userData.user.id);
        sessionStorage.setItem('userName', userData.user.name);
        sessionStorage.setItem('userEmail', userData.user.email || '');
        sessionStorage.setItem('token', userData.token); // Store JWT
        notify("Login Successful");

        navigate("/user-dash");
        return;
      }

      if (userResponse.status === 403) {
        notify(userData.message || "Your account has been blocked.");
        return;
      }


      // If User login fails, try Admin login
      const adminResponse = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const adminData = await adminResponse.json();

      if (adminResponse.ok) {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('token');
        sessionStorage.setItem('adminToken', adminData.token); // Store Admin JWT
        notify("Admin Login Successful");
        navigate("/admin-dash");
      } else {

        // If both fail, show generic error or the logic from the last attempt
        notify("Invalid email or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      notify("Error logging in");
    }
  };

  return (
    <div className="login-container">
      <div className="log">
        <div className="login-header">
          <img src={logoImage} alt="Logo" className="logo" />
          <button className="close-btn" onClick={() => navigate("/")}>×</button>
        </div>

        <h2 className="login-title">LOGIN</h2>
        
        <div className="form-group">
          <input type="text" name="email" placeholder="Email or Username" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        </div>

        <div className="forgot-password">
          <a href="#">Forgot password ?</a>
        </div>
        <button className="login-btn" onClick={handleSubmit}>LOGIN</button>

        <div className="divider"></div>

        {/* <div className="social-login">
          <FaGoogle className="social-icon google" />
          <FaFacebook className="social-icon facebook" />
          <FaApple className="social-icon apple" />
        </div> */}

        <p className="signup-text" onClick={() => navigate("/signup")}>
          Don't have an account ? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;




