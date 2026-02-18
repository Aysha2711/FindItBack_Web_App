import React from 'react';
import './../styles/contactusCss.css';
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaClock, FaPhone} from "react-icons/fa";
import SuccessModal from "../components/SuccessModal";
import { useFeedback } from "../context/FeedbackContext";

import contactImg from '../assets/contact.png'; // Replace with actual image path

const ContactUsUser = () => {
  const navigate = useNavigate();
  const { notify } = useFeedback();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        notify('Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      notify('Error sending message.');
    }
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    navigate(-1);
  };


  return (
    <>
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
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Message</label>
          <textarea
            rows="5"
            name="message"
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
          />

          <p className="privacy-note">We value your privacy. Your email will never be shared.</p>
          <button className="send-btn" onClick={handleSubmit}>Send Message</button>
        </div>

        <div className="contact-details">
          <h3>Contact Information</h3>
          <p><strong><FaEnvelope /> Email</strong><br />finditback@lostfound.com</p>
          <p><strong><FaPhone /> Phone</strong><br />+94 77 123 4567</p>
          <p><strong><FaClock /> Working Hours</strong><br />Mon – Fri: 9AM to 6PM</p>
        </div>
      </div>
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessOk}
        message="Successful"
      />

    </>
  );
};

export default ContactUsUser;


