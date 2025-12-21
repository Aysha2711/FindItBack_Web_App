import React from "react";
import "../styles/verifyformfoundCss.css";
import { Link,useNavigate } from "react-router-dom";
import { FaTag,  FaPhone, FaArrowLeft } from "react-icons/fa"


const VerificationFormFoundItem = () => {

    const navigate = useNavigate();

  return (
    <div className="vf-wrapperr">
        <Link to="/notify" className="back-link">
        <FaArrowLeft /> 
      </Link>
      <div className="vf-container">

        
        
        <div className="item-card11">
               
                <div className="item-details1">
                  <h3 >Contact Details</h3>
                  <p><FaTag /> Name: NM. Perera</p>
                  <p><FaPhone /> contact: 07676545676</p>
                 
                </div>
        </div>
        

      </div>
    </div>
  );
};

export default VerificationFormFoundItem;
