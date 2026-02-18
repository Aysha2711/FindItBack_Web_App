import React from "react";
import "./../styles/FooterCss.css";
import logoImg from "../assets/logo.png";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6"; // Twitter is now "X"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div>
          <h4>Quick Links</h4>
          <p>Home</p>
          <p>View Item (Lost/Found)</p>
          <p>Post Item (Lost/Found)</p>
          <p>About Us</p>
          <p>Contact Us</p>
        </div>
        <div>
          <h4>Legal</h4>
          <p>FAQs</p>
          <p>Terms of Service</p>
          <p>Privacy Policy</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Email: finditback@lostfoun.com</p>
          <p>Phone: +94 77 123 4567</p>
          <div className="socials">
            <FaFacebookF className="icon" />
            <FaXTwitter className="icon" />
          </div>
          <img src={logoImg} alt="logo" className="footer-logo" />
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 FindItBack. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;


