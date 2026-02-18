import React from 'react';
import './../styles/contactusCss.css';
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaClock, FaPhone} from "react-icons/fa";
import CmnNavbar from "../components/cmnNavbar";
import Footer from "../components/Footer";

import contactImg from '../assets/contact.png'; 

const ContactUs = () => {

  const navigate = useNavigate();


  return (
    <>
      <CmnNavbar />
      <div className="contact-hero">
        <div className="contact-hero-text">
          <h1>We're Here to Help!</h1>
          <p>Got questions or feedback?<br />Reach out and we'll get back to you soon.</p>
        </div>
        <img src={contactImg} alt="Contact Support" className="contact-hero-img" />
      </div>

      <div className="contact-container">
        <div className="contact-form">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" />

          <label>Email</label>
          <input type="email" placeholder="name@example.com" />

          <label>Message</label>
          <textarea rows="5" placeholder="Your message" />

          <p className="privacy-note">We value your privacy. Your email will never be shared.</p>
          <button className="send-btn"  onClick={() => navigate("/su-msg")}>Send Message</button>
        </div>

        <div className="contact-details">
          <h3>Contact Information</h3>
          <p><strong><FaEnvelope /> Email</strong><br />finditback@lostfound.com</p>
          <p><strong><FaPhone /> Phone</strong><br />+94 77 123 4567</p>
          <p><strong><FaClock /> Working Hours</strong><br />Mon – Fri: 9AM to 6PM</p>
        </div>
        
      </div>

    <Footer />
    </>
  );
};

export default ContactUs;
