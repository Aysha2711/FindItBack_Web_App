import React from "react";
import "../styles/verifyformfoundCss.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaShieldAlt, FaImage, FaLock, FaUser } from "react-icons/fa";
import pinkBag from "../assets/pinkbag.jpg";
import logo from "../assets/logo1.jpg";

const VerificationFormLost = () => {

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
                <button className="close-btn" onClick={() => navigate("/view-detail-found")}>×</button>
        </div>
        <h2 className="title">Think this item is yours? Help us verify!</h2>
         <div className="note">
                <p><FaShieldAlt /> Please answer the following questions to help us confirm that you are the rightful owner. The details you provide will only be shared with the person who reported finding the item for verification.</p>
              </div>
        <div className="item-card1">
                <img src={pinkBag} alt="Pink Side Bag" className="item-image" />
                <div className="item-details1">
                  <span className="found-label">FOUND ITEM</span>
                    <h2>Pink Side Bag</h2>
                    <ul className="item-info-list">
                        <li><FaTag /> Category: Bags & Wallets</li>
                        <li><FaCalendarAlt /> Date Found: 2025.05.15</li>
                        <li><FaMapMarkerAlt /> Found Area: Gampaha</li>
                        <li><FaPen /> Pink color bag with 4 exercise book and a plastic white color water bottle</li>
                    </ul>
                </div>
              </div>
        <form className="lost-form">
        
      
                <section className="form-section">
                  
                  <label>
                    <FaUser /> Full Name <FaLock />
                    <input type="text" placeholder="e.g., Namal Perera" required />
                  </label>

                  <label>
                    <FaMapMarkerAlt /> Where did you lose the item? <FaLock />
                    <input type="text" placeholder="e.g., Gampaha station Bench" required />
                    <small className="image-note">
                        Please be as specific as possible exact place
                    </small>
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
                    <FaPen /> Brief story (How you lost it) <FaLock />
                    <textarea placeholder="Any special remarks..." />
                  </label>
                </section>
                <div className="note">
                <p><FaShieldAlt /> This information will be reviewed by the person who found the item. If your claim is verified, you’ll receive their contact details to retrieve it.</p>
              </div>
                <div className='btn'>
                  <button type="submit" className="submit-btn"  onClick={() => navigate("/success-msg")}>Submit Claim</button>
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

export default VerificationFormLost;
