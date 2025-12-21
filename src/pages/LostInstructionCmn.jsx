import React from 'react';
import { FaArrowLeft, FaCamera, FaLock, FaBullhorn, FaUserCheck, FaCheckCircle, FaExclamationTriangle, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import './../styles/LostInstructionCss.css';
import lostIcon from '../assets/lostintoimg.png';
import { Link } from 'react-router-dom';
import CmnNavbar from "../components/cmnNavbar";
import Footer from "../components/Footer";

const LostInstructionCmn = () => {
  return (
    <div className="lost-instruction">
        <CmnNavbar />
   <p></p>
      <div className="top-section">
        <Link to="/about" className="back-btn"><FaArrowLeft /></Link>
        <div className="top-content">
          <div className="text-content">
            <h1>Lost something important?</h1>
            <p>Here's how we help you find it</p>
            <Link to="/post-lost-item" className="btn-post">Post Lost Item</Link>
          </div>
          <img src={lostIcon} alt="Lost Icon" className="lost-icon" />
        </div>
      </div>

      <div className="steps-section">
        <h2>How to Get Your Lost Item Back</h2>
        <div className="steps-cards">
          <div className="card">
            <FaCamera className="icon" />
            <h3>1</h3>
            <p><strong>Submit a Lost Report</strong><br />Fill in the item details, when and where you lost it. The more details, the better!</p>
          </div>
          <div className="card">
            <FaLock className="icon" />
            <h3>2</h3>
            <p><strong>Keep Your Clues Private</strong><br />Some details are kept private and only used to verify your ownership.</p>
          </div>
          <div className="card">
            <FaBullhorn className="icon" />
            <h3>3</h3>
            <p><strong>We Publish the Public Info</strong><br />We post the public details and image on the site for finders to view.</p>
          </div>
          <div className="card">
            <FaUserCheck className="icon" />
            <h3>4</h3>
            <p><strong>Finder Submits a Claim</strong><br />If someone thinks they found your item, they’ll answer verification questions.</p>
          </div>
          <div className="card">
            <FaCheckCircle className="icon" />
            <h3>5</h3>
            <p><strong>You Review Their Claim</strong><br />You review their answers and approve if the info matches. Once you verified, your contact info will be shared!</p>
          </div>
        </div>
      </div>

      <p></p>

      <div className="steps-section">
        <h2>Helpful Tips for People Who Lost an Item</h2>
        <div className="tips-cards">
          <div className="tip-card">
            <FaExclamationTriangle className="icon" />
            <p>Add clear photos <br />(but hide unique features!)</p>
          </div>
          <div className="tip-card">
            <FaMapMarkerAlt className="icon" />
            <p>Be specific about the location and date</p>
          </div>
          <div className="tip-card">
            <FaShieldAlt className="icon" />
            <p>Check your dashboard regularly</p>
          </div>
        </div>
      </div>

      <div className="final-cta">
        <h3>Ready to report your lost item?</h3>
        <Link to="/post-lost-item" className="btn-post">Post Lost Item</Link>
      </div>
      <Footer />
    </div>
  );
};

export default LostInstructionCmn;
