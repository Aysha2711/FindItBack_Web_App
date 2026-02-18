import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../styles/NavbarCss.css";
import logoImg from "../assets/logo1.jpg";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logoImg} alt="FindItBack logo" className="navbar-logo" />
      </div>
      
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </div>

      
      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <li><Link to="/user-dash" onClick={() => setIsOpen(false)}>HOME</Link></li>
        <li className="dropdown">
          <a href="#!">VIEW ITEMS ▾</a>
          <ul className="dropdown-content">
            <li><Link to="/view-lost" onClick={() => setIsOpen(false)}>Lost Items</Link></li>
            <li><Link to="/view-found" onClick={() => setIsOpen(false)}>Found Items</Link></li>
          </ul>
        </li>
        <li className="dropdown">
          <a href="#!">POST ITEM ▾</a>
          <ul className="dropdown-content">
            <li><Link to="/post-lost-item" onClick={() => setIsOpen(false)}>Report Lost</Link></li>
            <li><Link to="/post-found-item" onClick={() => setIsOpen(false)}>Report Found</Link></li>
          </ul>
        </li>
        <li><Link to="/about-user" onClick={() => setIsOpen(false)}>ABOUT US</Link></li>
        <li><Link to="/contact-user" onClick={() => setIsOpen(false)}>CONTACT US</Link></li>

        
        <li className="icon-btn">
          <FaBell className="nav-icon" title="Notifications" />
        </li>


        <li className="profile-dropdown">
          <FaUserCircle
            className="nav-icon"
            title="Profile"
            onClick={() => setProfileOpen(!profileOpen)}
          />
          {profileOpen && (
            <ul className="profile-menu">
              <li className="profile-info">John Doe<br /><span>johndoe@email.com</span></li>
              <li><Link to="/edit-profile" onClick={() => setProfileOpen(false)}>Edit Profile</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
