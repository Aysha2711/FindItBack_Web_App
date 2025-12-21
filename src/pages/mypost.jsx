import React from "react";
import "../styles/verifyformfoundCss.css";
import { Link} from "react-router-dom";
import { FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaArrowLeft } from "react-icons/fa";
import pinkBag from "../assets/nikeShoe.jpg";
import bagImage from "../assets/pinkbag.jpg";


const VerificationFormFoundItem = () => {

  return (
    <div className="vf-wrapperr">
      
        <Link to="/user-dash" className="back-link">
        <FaArrowLeft /> 
      </Link>
      <div className="vf-container">

        
        
        <div className="item-card11">
                <img src={pinkBag} alt="Pink Side Bag" className="item-image1" />
                <div className='btn'>
                  <button type="submit" className="submit-btn1">Delete</button>
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
        

        <div className="item-card11">
                <img src={bagImage} alt="Pink Side Bag" className="item-image1" />
                <div className='btn'>
                  <button type="submit" className="submit-btn1">Delete</button>
                </div>
                <div className="item-details1">
                  <span className="found-label">FOUND ITEM</span>
                  <h3>Pink Side Bag</h3>
                  <p><FaTag /> Category: Bags & Wallets</p>
                  <p><FaCalendarAlt /> Date Found: 2025.05.15</p>
                  <p><FaMapMarkerAlt /> Found Area: Gampaha</p>
                  <p><FaPen /> Pink color bag with 4 exercise book and a plastic white color water bottle</p>
                  <p>
                     
                  </p>
                 
                </div>
        </div>

      </div>
    </div>
  );
};

export default VerificationFormFoundItem;
