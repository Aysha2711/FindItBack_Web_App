import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../styles/NavbarCss.css";
import logoImg from "../assets/logo1.jpg";
import {FaBars } from "react-icons/fa"; 

const CmnNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logoImg} alt="FindItBack logo" className="navbar-logo" />
      </div>

      <div
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars />
      </div>

      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>HOME</Link></li>
        <li className="dropdown">
          <a href="">VIEW ITEMS ▾</a>
          <ul className="dropdown-content">
            <li><Link to="/login" onClick={() => setIsOpen(false)}>Lost Items</Link></li>
            <li><Link to="/login" onClick={() => setIsOpen(false)}>Found Items</Link></li>
          </ul>
        </li>
        <li className="dropdown">
          <a href="">POST ITEM ▾</a>
          <ul className="dropdown-content">
            <li><Link to="/login" onClick={() => setIsOpen(false)}>Report Lost</Link></li>
            <li><Link to="/login" onClick={() => setIsOpen(false)}>Report Found</Link></li>
          </ul>
        </li>
        <li><Link to="/about" onClick={() => setIsOpen(false)}>ABOUT US</Link></li>
        <li><Link to="/contact" onClick={() => setIsOpen(false)}>CONTACT US</Link></li>
        <li>
          <Link to="/login" onClick={() => setIsOpen(false)}>
            <button className="login-btnn">LOGIN</button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default CmnNavbar;
