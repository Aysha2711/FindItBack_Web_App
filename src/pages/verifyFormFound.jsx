import React from "react";
import "../styles/verifyformfoundCss.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaShieldAlt, FaImage, FaLock } from "react-icons/fa";
import pinkBag from "../assets/nikeShoe.jpg";
import logo from "../assets/logo1.jpg";

const VerificationFormFoundItem = () => {

    const navigate = useNavigate();

  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  return (
    <div className="vf-wrapper">
      <div className="vf-container">
        <div className="verify-header">
                <img src={logo} alt="Logo" className="logo" />
                <button className="close-btn" onClick={() => navigate("/view-detail-lost")}>×</button>
        </div>
        <h2 className="title">Help Us Verify You Found This Item</h2>
         <div className="note">
                <p><FaShieldAlt /> Please answer the following questions to help us confirm your claim. The details you provide will only be shared with the original reporter for verification.</p>
              </div>
        <div className="item-card1">
                <img src={pinkBag} alt="Pink Side Bag" className="item-image" />
                <div className="item-details1">
                  <span className="lost-label">LOST ITEM</span>
                  <h3>Nike Linen Shoe</h3>
                  <p><FaTag /> Category: Clothing & Accessories</p>
                  <p><FaCalendarAlt /> Date Found: 2025.05.15</p>
                  <p><FaMapMarkerAlt /> Found Area: Gampaha</p>
                  <p><FaPen /> PSize - 40<br/>Nike brand<br/>Boys one</p>
                </div>
              </div>
        <form className="lost-form">
        
                <section className="form-section">
                  
                  <label>
                    <FaMapMarkerAlt /> Where did you found the item? <FaLock />
                    <input type="text" placeholder="e.g., Gampaha station Bench" required />
                    <small className="image-note">
                        Please be as specific as possible exact place
                    </small>
                  </label>
        
                  <label>
                    <FaCalendarAlt /> Found Date & Time <FaLock />
                    <input type="datetime-local" required />
                  </label>

                   <label>
                    <FaPen /> Describe any distinguish features <FaLock/>
                    <textarea placeholder="Brief description..." />
                  </label>

                  <label>
                              <FaImage /> Upload Image
                              <div className="upload-box">
                                <FaImage className="upload-icon" />
                                <p className="upload-text">
                                  Drag and drop your image here, or{" "}
                                  <span className="file-select"> {/* CHANGED */}
                                    click to select
                                    <input
                                      type="file"
                                      accept="image/jpeg, image/png"
                                      onChange={handleFileChange}
                                    />
                                  </span>
                                </p>
                                <p className="upload-subtext">Accepted formats: JPG, PNG</p>
                                {fileName && <p className="file-name">Selected file: {fileName}</p>}
                              </div>
                            </label>

                   <label>
                    <FaPen /> Brief story (How you found it) <FaLock />
                    <textarea placeholder="Any special remarks..." />
                  </label>
                </section>
                <div className="note">
                <p><FaShieldAlt /> This information will be reviewed by the original reporter to validate your claim. If verified, you'll receive their contact details to return the item.</p>
              </div>
                <div className='btn'>
                  <button type="submit" className="submit-btn"  onClick={() => navigate("/success-msg")}>Submit Claim For Review</button>
                </div>
              </form>
        <footer className="verify-footer">
        <div className="verify-footer-links">
            <a href="/coming-soon">Terms of Service</a>
            <a href="/coming-soon">Privacy Policy</a>
            <a href="/coming-soon">Cookie Policy</a>
            <a href="/coming-soon">Help Center</a>
        </div>
        <p>© 2025 FindItBack. All Rights Reserved</p>
    </footer>

      </div>
    </div>
  );
};

export default VerificationFormFoundItem;
