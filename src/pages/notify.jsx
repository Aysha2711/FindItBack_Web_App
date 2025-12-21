import React from "react";
import "../styles/verifyformfoundCss.css";
import { Link,useNavigate } from "react-router-dom";
import { FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaArrowLeft } from "react-icons/fa";
import pinkBag from "../assets/nikeShoe.jpg";


const VerificationFormFoundItem = () => {

    const navigate = useNavigate();

  return (
    <div className="vf-wrapperr">
        <Link to="/user-dash" className="back-link">
        <FaArrowLeft /> 
      </Link>
      <div className="vf-container">

        
        
        <div className="item-card11">
                <img src={pinkBag} alt="Pink Side Bag" className="item-image1" />
                <div className='btn'>
                  <button type="submit" className="submit-btn12" onClick={() => navigate("/con-detail")}>view</button>
                </div>
                <div className="item-details1">
                  <span className="lost-label">LOST ITEM</span>
                  <h3>Nike Linen Shoe</h3>
                  <p><FaTag /> Category: Clothing & Accessories</p>
                  <p><FaCalendarAlt /> Date Found: 2025.05.15</p>
                  <p><FaMapMarkerAlt /> Found Area: Gampaha</p>
                  <p><FaPen /> Size - 40<br/>Nike brand<br/>Boys one</p>
                  <p>
                     
                  </p>
                 
                </div>
        </div>
        

      </div>
    </div>
  );
};

export default VerificationFormFoundItem;
