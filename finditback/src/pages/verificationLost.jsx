import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaShieldAlt, FaImage } from "react-icons/fa";
import "./../styles/verificationlostCss.css";
import pinkBag from "../assets/nikeShoe.jpg";
import logo from "../assets/logo1.jpg";

const VerifyLost = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;

  if (!item) {
    return <div className="claim-verification-page"><h2>No item specified for review</h2><button onClick={() => navigate(-1)}>Back</button></div>;
  }

  return (
    <div className="claim-verification-page">
      <div className="verify-header">
        <img src={logo} alt="Logo" className="logo" />
        <button className="close-btn" onClick={() => navigate("/user-dash")}>×</button>

      </div>
      <h2 className="title">Review Found Item Claim</h2>
      <p className="subtitle">
        Someone believes this item founds by them. Please review their answers below and verify if it matches what you lost.
      </p>

      <div className="item-card1">
        <img
          src={item.image || pinkBag}
          alt={item.title}
          className="item-image"
          onError={(e) => { e.target.onerror = null; e.target.src = pinkBag; }}
        />
        <div className="item-details1">
          <span className={item.typeClass}>{item.type}</span>
          <h3>{item.title}</h3>
          <p><FaTag /> Category: {item.category}</p>
          <p><FaCalendarAlt /> Date Found: {item.date}</p>
          <p><FaMapMarkerAlt /> Found Area: {item.location}</p>
          <p><FaPen /> {item.description}</p>
        </div>
      </div>

      <div className="answers-card">
        <h4>Submitted Details</h4>
        <p><FaMapMarkerAlt /> <strong>Where did you find the item?</strong><br />Gampaha railway station bench</p>
        <p><FaCalendarAlt /> <strong>Found Date & Time </strong><br />2025.05.15 : 3:30p.m.</p>
        <p><FaPen /> <strong>Describe any distinguishing features</strong><br />It had a scratch on the left side rigth shoe</p>
        <p><FaImage /> <strong>Upload any proof</strong></p>
        <div className="proof-placeholder"></div>
      </div>


      <div className="decision-card">
        <p>Does the provided information match your lost item?</p>
        <div className="buttons1">
          <button className="accept">Accept Claim</button>
          <button className="reject">Reject Claim</button>
        </div>
      </div>


      <div className="note">
        <p><FaShieldAlt /> Someone has submitted a claim saying they found your lost item. Please review their responses and accept if the details match. If you accept, your contact info will be shared with them to coordinate the return.</p>
      </div>

      <footer className="verify-footer">
        <div className="verify-footer-links">
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

export default VerifyLost;


