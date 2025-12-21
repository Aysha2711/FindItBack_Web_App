import React from "react";
import { Link, useNavigate} from "react-router-dom";
import { FaArrowLeft, FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaLock, FaShieldAlt} from "react-icons/fa";
import "../styles/viewdetailedlostCss.css";
import bagImage from "../assets/nikeShoe.jpg";

const ItemDetailLostView = () => {

  const navigate = useNavigate();

  return (
    <div className="item-detail-page">
   
      <Link to="/view-lost" className="back-link">
        <FaArrowLeft /> Back to Lost Items
      </Link>

    
      <div className="item-detail-main">
     
        <div className="item-image-section">
          <img
            src={bagImage} 
            alt="Lost Item"
            className="lost-item-image"
          />
          <div className="claim-section">
            <p className="claim-text">Have you found this item?</p>
            <button
                  className="claim-btn"
                  onClick={() => navigate("/verify-form-found")}>Submit Claim</button>
            <p className="claim-note">You’ll be asked to answer a few questions to confirm ownership.</p>
          </div>
        </div>

 
        <div className="item-info-section">
          <span className="lost-label">LOST ITEM</span>
          <h2>Nike Linen Shoe</h2>
          <ul className="item-info-list">
            <li><FaTag /> Category: Clothing & Accessories</li>
            <li><FaCalendarAlt /> Date Found: 2025.03.28</li>
            <li><FaMapMarkerAlt /> Found Area: Ampara</li>
            <li><FaPen />
              <ul>
                <li>Size - 40</li>
                <li>Nike Brand</li>
                <li>Boys One</li>
              </ul>
            </li>
            
          </ul>
          <div className="info-box">
            <p><FaLock /> This post doesn't display exact found location or contact details. These will be shared only upon valid claim.</p>
            <p><FaShieldAlt /> In case of valuable items, any unique features may have been hidden from the item image.</p>
          </div>
        </div>
      </div>

   
      <div className="other-items-section">
        <h3>Other Items</h3>
        <div className="other-items-list">
         
          <div className="item-card">
            <img src={bagImage}alt="Item" />
            <p className="item-title">Nike Linen Shoe</p>
            <p className="item-meta">Clothing & Accessories • Ampara</p>
            <p className="item-date">Found 2025.03.28</p>
            <button className="view-btn">View Details</button>
          </div>

          <div className="item-card">
            <img src={bagImage} alt="Item" />
            <p className="item-title">Nike Linen Shoe</p>
            <p className="item-meta">Clothing & Accessories • Ampara</p>
            <p className="item-date">Found 2025.03.28</p>
            <button className="view-btn">View Details</button>
          </div>
        </div>
        <Link to="/found-items" className="view-more-link">
          View More →
        </Link>
      </div>

      </div>
  );
};

export default ItemDetailLostView;
