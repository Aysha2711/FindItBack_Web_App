import React, { useState, useEffect } from "react";
import "../styles/verifyformfoundCss.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaShieldAlt, FaImage, FaLock, FaUser, FaTimes } from "react-icons/fa";
import pinkBag from "../assets/pinkbag.jpg";
import logo from "../assets/logo1.jpg";
import SuccessModal from "../components/SuccessModal";
import { useFeedback } from "../context/FeedbackContext";

const VerificationFormLost = ({ item: itemProp, onClose }) => {
  const navigate = useNavigate();
  const { notify } = useFeedback();
  const location = useLocation();
  const item = itemProp || location.state?.item;

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate("/user-dash");
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    if (onClose) {
      onClose();
      return;
    }
    navigate(-1);
  };

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    lost_location: '',
    lost_date: '',
    features: '',
    story: ''
  });

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageFiles(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(prev => {
      const urlToRemove = prev[indexToRemove];
      if (urlToRemove) URL.revokeObjectURL(urlToRemove);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('found_item_id', item.id);
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    const userId = sessionStorage.getItem('userId');
    if (!userId || userId === 'null' || userId === 'undefined') {
      notify("You must be logged in to submit a claim.");
      navigate("/login");
      return;
    }
    data.append('user_id', userId);

    if (imageFiles.length > 0) {
      // Current verify API accepts one image field.
      data.append('image', imageFiles[0]);
    }

    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/items/verify-found', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        const errorData = await response.json();
        notify('Error: ' + (errorData.error || 'Failed to submit claim'));
      }
    } catch (error) {
      console.error('Submission error:', error);
      notify('Error submitting claim. Please try again.');
    }
  };

  return (
    <div className="vf-wrapper">
      <div className="vf-container" style={{ position: "relative" }}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close popup">
          <FaTimes />
        </button>
        {!onClose && (
          <div className="verify-header">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        )}
        <h2 className="title">Think this item is yours? Help us verify!</h2>
        <div className="note">
          <p><FaShieldAlt /> Please answer the following questions to help us confirm that you are the rightful owner. The details you provide will only be shared with the person who reported finding the item for verification.</p>
        </div>
        <div className="item-card1">
          <img
            src={item.image ? `http://localhost:5000/${item.image.replace(/\\/g, '/')}` : pinkBag}
            alt={item.name}
            className="item-image"
            onError={(e) => { e.target.onerror = null; e.target.src = pinkBag; }}
          />
          <div className="item-details1">
            <span className="found-label">FOUND ITEM</span>
            <h3>{item.name}</h3>
            <ul className="item-info-list">
              <li><FaTag /> Category: {item.category}</li>
              <li><FaCalendarAlt /> Date Found: {item.date}</li>
              <li><FaMapMarkerAlt /> Found Area: {item.area}</li>
              <li><FaPen /> {item.description}</li>
            </ul>
          </div>
        </div>
        <form className="lost-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <label>
              <FaUser /> Full Name <FaLock />
              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                required
                value={formData.full_name}
                onChange={handleInputChange}
              />
            </label>

            <label>
              <FaMapMarkerAlt /> Where did you lose the item? <FaLock />
              <input
                type="text"
                name="lost_location"
                placeholder="e.g., Gampaha station Bench"
                required
                value={formData.lost_location}
                onChange={handleInputChange}
              />
              <small className="image-note">
                Please be as specific as possible exact place
              </small>
            </label>

            <label>
              <FaCalendarAlt /> Lost Date & Time <FaLock />
              <input
                type="datetime-local"
                name="lost_date"
                required
                value={formData.lost_date}
                onChange={handleInputChange}
              />
            </label>

            <label>
              <FaPen /> Describe any distinguish features <FaLock />
              <textarea
                name="features"
                placeholder="Brief description..."
                value={formData.features}
                onChange={handleInputChange}
              />
            </label>

            <label>
              <FaImage /> Upload any proof(optional) <FaLock />
              <div className="upload-box">
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  id="verify-upload-lost"
                  className="file-input"
                  multiple
                  onChange={handleFileChange}
                />
                <FaImage className="upload-icon" />
                <p className="upload-text">
                  Drag and drop your images here, or <span>click to select</span>
                </p>
                <p className="upload-subtext">Accepted formats: JPG, PNG</p>
                {imageFiles.length > 0 && <p className="file-name">{imageFiles.length} image(s) selected</p>}
              </div>

              {previewUrls.length > 0 && (
                <div className="preview-grid">
                  {previewUrls.map((previewUrl, index) => (
                    <div className="preview-card" key={`${previewUrl}-${index}`}>
                      <img src={previewUrl} alt={`Selected ${index + 1}`} className="preview-image" />
                      <button
                        type="button"
                        className="remove-preview-btn"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="add-photo-btn"
                onClick={() => document.getElementById('verify-upload-lost')?.click()}
              >
                + Add another picture
              </button>
            </label>

            <label>
              <FaPen /> Brief story (How you lost it) <FaLock />
              <textarea
                name="story"
                placeholder="Any special remarks..."
                value={formData.story}
                onChange={handleInputChange}
              />
            </label>
          </section>
          <div className="note">
            <p><FaShieldAlt /> This information will be reviewed by the person who found the item. If your claim is verified, you will receive their contact details to retrieve it.</p>
          </div>
          <div className='btn'>
            <button type="submit" className="submit-btn">Submit Claim</button>
          </div>
        </form>
        {!onClose && (
          <footer className="verify-footer">
            <div className="verify-footer-links">
              <a href="/coming-soon">Terms of Service</a>
              <a href="/coming-soon">Privacy Policy</a>
              <a href="/coming-soon">Cookie Policy</a>
              <a href="/coming-soon">Help Center</a>
            </div>
            <p>&copy; 2025 FindItBack. All Rights Reserved</p>
          </footer>
        )}
      </div>
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessOk}
        message="Successful"
      />
    </div>
  );
};

export default VerificationFormLost;


