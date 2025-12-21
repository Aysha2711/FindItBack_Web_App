import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaBox, FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaPhone, FaImage } from "react-icons/fa";
import '../styles/PostlostitemCss.css';

const PostLostItem = () => {
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
    <div className="post-lost-container">
      <div className="close-header">
        <button className="close-btn" onClick={() => navigate("/user-dash")}>×</button>
      </div>
      <h1 className="title">Report a Found Item</h1>
      <p className="subtitle">
        Help reunite lost items with their owners.
      </p>

      <form className="lost-form">
        {/* Public Details */}
        <section className="form-section">
          <h2>🌐 Public Details</h2>
          <h6>These fields are visible to everyone and help the real owner spot their item.</h6>

          <label>
            <FaBox /> Item Name
            <input type="text" placeholder="e.g., Black Wallet" required />
          </label>

          <label>
            <FaTag /> Category
            <select required>
              <option value="">Select</option>
              <option value="Phone">Phone</option>
              <option value="Wallet">Wallet</option>
              <option value="Bag">Bag</option>
              <option value="ID Card">ID Card</option>
              <option value="Others">Others</option>
            </select>
          </label>

          <label>
            <FaCalendarAlt /> Found Date
            <input type="date" required />
          </label>

          <label>
            <FaMapMarkerAlt /> Found Area
            <select required>
              <option value="">Select Area</option>
              <option value="Vavuniya Bus Stand">Vavuniya Bus Stand</option>
              <option value="Vavuniya Railway Station">Vavuniya Railway Station</option>
              <option value="Main Market">Main Market</option>
              <option value="University Area">University Area</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            <FaImage /> Upload Image
            <div className="upload-box">
              <FaImage className="upload-icon" />
              <p className="upload-text">
                Drag and drop your image here, or{" "}
                <span className="file-select"> 
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
            <small className="image-note">
              To protect your item, don’t reveal special features in photos. They’ll be used for claim verification.
            </small>
          </label>

          <label>
            <FaPen /> Short Description
            <textarea placeholder="Brief description..." />
          </label>
        </section>

        {/* Private Details */}
        <section className="form-section">
          <h2>🔒 Private Details</h2>
          <h6>This information is private and will only be used to contact you when a verified lost matched.</h6>

          <label>
            <FaMapMarkerAlt /> Exact Location
            <input type="text" placeholder="e.g., in front of XYZ shop" />
          </label>

          <label>
            <FaPhone /> Email or Phone Number
            <input type="text" placeholder="you@example.com / +94XXXXXXXXX" required />
          </label>

          <label>
            <FaPen /> Notes for Admin (optional)
            <textarea placeholder="Any special remarks..." />
          </label>
        </section>

        <div className='btn'>
          <button
            type="submit"
            className="submit-btn"
            onClick={() => navigate("/success-msg")}
          >
            Submit Found Item Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostLostItem;
