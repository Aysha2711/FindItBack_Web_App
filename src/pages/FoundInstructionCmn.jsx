import React from 'react';
import { FaArrowLeft, FaCamera, FaLock, FaBullhorn, FaUserCheck, FaCheckCircle, FaExclamationTriangle, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import './../styles/LostInstructionCss.css';
import foundImg from "../assets/foundintroimg.png"; 
import { Link } from 'react-router-dom';
import CmnNavbar from "../components/cmnNavbar";
import Footer from "../components/Footer";

const FoundInstructionsCmn = () => {
  return (
    <div className="lost-instruction">
        <CmnNavbar />
   <p></p>
      <div className="top-section">
        <Link to="/about" className="back-btn"><FaArrowLeft /></Link>
        <div className="top-content">
          <div className="text-content">
            <h1>Found someone's lost item?</h1>
            <p>Help get it back to the rightful owner.</p>
            <Link to="/post-found-item" className="btn-post">Post Found Item</Link>
          </div>
          <img src={foundImg} alt="Lost Icon" className="lost-icon" />
        </div>
      </div>

      <div className="steps-section">
        <h2>How to return a found item</h2>
        <div className="steps-cards">
          <div className="card">
            <FaCamera className="icon" />
            <h3>1</h3>
            <p><strong>Post the found item</strong><br />Share item details, where and when you found it. Add a photo (hide unique features if valuable).</p>
          </div>
          <div className="card">
            <FaLock className="icon" />
            <h3>2</h3>
            <p><strong>We Keep Private Info Safe</strong><br />Your contact info and exact location are kept private until verification.</p>
          </div>
          <div className="card">
            <FaBullhorn className="icon" />
            <h3>3</h3>
            <p><strong>We Publish the Post</strong><br />Your post is shown publicly with general info and photo.</p>
          </div>
          <div className="card">
            <FaUserCheck className="icon" />
            <h3>4</h3>
            <p><strong>Owner Submits a Claim</strong><br />Someone who lost the item fills out a form to prove it's theirs.</p>
          </div>
          <div className="card">
            <FaCheckCircle className="icon" />
            <h3>5</h3>
            <p><strong>You Verify Their Claim</strong><br />You review their answers and approve if the info matches. Once you verified, your contact info will be shared!</p>
          </div>
        </div>
      </div>

      <p></p>

      <div className="steps-section">
        <h2>Helpful Tips for Finders</h2>
        <div className="tips-cards">
          <div className="tip-card">
            <FaExclamationTriangle className="icon" />
            <p>Don't reveal specific details in photos<br />(e.g., serial numbers, labels).</p>
          </div>
          <div className="tip-card">
            <FaMapMarkerAlt className="icon" />
            <p>Use district/area only, not exactlocation.</p>
          </div>
          <div className="tip-card">
            <FaShieldAlt className="icon" />
            <p>Only approve a claim if you're confident the details match.</p>
          </div>
        </div>
      </div>

      <div className="final-cta">
        <h3>Ready to return what you found?</h3>
        <Link to="/post-found-item" className="btn-post">Post Found Item</Link>
      </div>
      <Footer />
    </div>
  );
};

export default FoundInstructionsCmn;
