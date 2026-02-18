import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaBox, FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaPhone, FaImage } from "react-icons/fa";
import '../styles/PostlostitemCss.css';
import { CATEGORY_OPTIONS } from "../constants/categoryOptions";
import { useFeedback } from "../context/FeedbackContext";

const PostLostItem = () => {
  const navigate = useNavigate();
  const { notify } = useFeedback();
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    date: '',
    area: '',
    description: '',
    exact_location: '',
    contact_info: '',
    admin_notes: ''
  });

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId && userId !== 'null' && userId !== 'undefined') {
      fetch(`http://localhost:5000/api/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.phone_number || data.email) {
            setFormData(prev => ({
              ...prev,
              contact_info: data.phone_number || data.email
            }));
          }
        })
        .catch(err => console.error("Error fetching user contact info:", err));
    }
  }, []);

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
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      data.append('user_id', userId);
    }

    if (imageFiles.length > 0) {
      // Current API accepts one image field.
      data.append('image', imageFiles[0]);
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/items/lost', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        notify('Lost item reported successfully!');
        const isAdmin = sessionStorage.getItem('isAdminMode') === 'true';
        navigate(isAdmin ? "/" : "/user-dash");
      } else {
        const errorData = await response.json();
        notify('Error: ' + (errorData.error || 'Failed to submit report'));
      }
    } catch (error) {
      console.error('Submission error:', error);
      notify('Error submitting report. Please try again.');
    }
  };

  return (
    <div className="post-lost-container">
      <button className="close-btn" onClick={() => {
        const isAdmin = sessionStorage.getItem('isAdminMode') === 'true';
        navigate(isAdmin ? "/" : "/user-dash");
      }}>&times;</button>

      <h1 className="title">Report a Lost Item</h1>
      <p className="subtitle">
        Lost something? We are here to help. Fill in the details so others can recognize and return your item.
      </p>

      <form className="lost-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <h2>Public Details</h2>
          <h6>These fields are visible to everyone and help the real owner spot their item.</h6>

          <label>
            <FaBox /> What did you lose?
            <input
              type="text"
              name="name"
              placeholder="e.g., Black Wallet"
              required
              onChange={handleInputChange}
            />
          </label>

          <label>
            <FaTag /> Category
            <select name="category" required onChange={handleInputChange}>
              <option value="">Select</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>

          <label>
            <FaCalendarAlt /> Date
            <input
              type="date"
              name="date"
              required
              onChange={handleInputChange}
            />
          </label>

          <label>
            <FaMapMarkerAlt /> Where did you lose it?
            <select name="area" required onChange={handleInputChange}>
              <option value="">Select Area</option>
              <option value="University of Vavuniya">University of Vavuniya</option>
              <option value="Applied Faculty">Applied Faculty</option>
              <option value="BS Faculty">BS Faculty</option>
              <option value="Library">Library</option>
              <option value="Common hall">Common hall</option>
            </select>
          </label>

          <label>
            <FaImage /> Upload Image
            <div className="upload-box">
              <input
                type="file"
                accept="image/jpeg, image/png"
                id="file-upload-lost"
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
              onClick={() => document.getElementById('file-upload-lost')?.click()}
            >
              + Add another picture
            </button>

            <small className="image-note">
              To protect your item, do not reveal special features in photos. They will be used for claim verification.
            </small>
          </label>

          <label>
            <FaPen /> Describe your item
            <textarea
              name="description"
              placeholder="Brief description..."
              onChange={handleInputChange}
            />
          </label>
        </section>

        <section className="form-section">
          <h2>Private Details</h2>
          <h6>We keep your contact information private. It will only be used if someone verifies ownership of your lost item.</h6>

          <label>
            <FaMapMarkerAlt /> Exact Location (not public)
            <input
              type="text"
              name="exact_location"
              placeholder="e.g., in front of XYZ shop"
              onChange={handleInputChange}
            />
          </label>

          <label>
            <FaPhone /> Email or Phone Number
            <input
              type="text"
              name="contact_info"
              placeholder="you@example.com / +94XXXXXXXXX"
              required
              onChange={handleInputChange}
            />
          </label>

          <label>
            <FaPen /> Notes for Admin (optional)
            <textarea
              name="admin_notes"
              placeholder="Any special remarks..."
              onChange={handleInputChange}
            />
          </label>
        </section>
        <div className='btn'>
          <button type="submit" className="submit-btn">Submit Lost Item Report</button>
        </div>

      </form>
    </div>
  );
};

export default PostLostItem;


