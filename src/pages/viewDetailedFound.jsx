import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaLock, FaShieldAlt, FaArrowLeft} from "react-icons/fa";
import "../styles/viewdetailedfoundCss.css";
import bagImage from "../assets/pinkbag.jpg";

const ItemDetailFoundView = () => {

   const navigate = useNavigate();

  return (
    <div className="item-detail-page">

      <Link to="/view-found" className="back-link">
        <FaArrowLeft /> Back to Found Items
      </Link>

      <div className="item-detail-main">
 
        <div className="item-image-section">
          <img
            src={bagImage} 
            alt="Found Item"
            className="found-item-image"
          />
          <div className="claim-section">
            <p className="claim-text">Think this is yours?</p>
            <button
                  className="claim-btn"
                  onClick={() => navigate("/verify-form-lost")}>Claim Item</button>
            <p className="claim-note">You’ll be asked to answer a few questions to confirm ownership.</p>
          </div>
        </div>

    
        <div className="item-info-section">
          <span className="found-label">FOUND ITEM</span>
          <h2>Pink Side Bag</h2>
          <ul className="item-info-list">
            <li><FaTag /> Category: Bags & Wallets</li>
            <li><FaCalendarAlt /> Date Found: 2025.05.15</li>
            <li><FaMapMarkerAlt /> Found Area: Gampaha</li>
            <li><FaPen /> Pink color bag with 4 exercise book and a plastic white color water bottle</li>
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
            <p className="item-title">Pink Side Bag</p>
            <p className="item-meta">Bags & Wallets • Gampaha</p>
            <p className="item-date">Found 2025.05.15</p>
            <button className="view-btn">View Details</button>
          </div>

          <div className="item-card">
            <img src={bagImage} alt="Item" />
            <p className="item-title">Pink Side Bag</p>
            <p className="item-meta">Bags & Wallets • Gampaha</p>
            <p className="item-date">Found 2025.05.15</p>
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

export default ItemDetailFoundView;
