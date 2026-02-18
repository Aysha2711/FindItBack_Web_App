import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./../styles/NavbarCss.css";
import logoImg from "../assets/logo1.jpg";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");
  const isAdminLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
  const isUserLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const homeRoute = isUserLoggedIn ? "/user-dash" : "/";
  const [userData, setUserData] = useState({
    name: sessionStorage.getItem("userName") || "User",
    email: sessionStorage.getItem("userEmail") || ""
  });
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId && userId !== "null" && userId !== "undefined") {
        try {
          const response = await fetch(`http://localhost:5000/api/user/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setUserData({ name: data.name || "User", email: data.email || "" });
            sessionStorage.setItem("userName", data.name || "User");
            sessionStorage.setItem("userEmail", data.email || "");
          }
        } catch (error) {
          console.error("Navbar: Error fetching user data:", error);
        }
      } else if (sessionStorage.getItem("isAdminLoggedIn") === "true") {
        setUserData({ name: "Admin", email: "admin@system.com" });
      }
    };

    fetchUserData();
  }, [userId]);

  const closeMenus = () => {
    setIsOpen(false);
    setProfileOpen(false);
    setActiveDropdown("");
  };

  const toggleDropdown = (key) => {
    setActiveDropdown((prev) => (prev === key ? "" : key));
  };

  return (
    <nav className="navbar user-navbar">
      <div className="logo-container">
        <Link to={homeRoute} onClick={closeMenus}>
          <img src={logoImg} alt="FindItBack logo" className="navbar-logo" />
        </Link>
      </div>

      <button type="button" className="menu-toggle" onClick={() => setIsOpen((prev) => !prev)} aria-label="Toggle menu">
        {"\u2630"}
      </button>

      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <li><Link to={homeRoute} onClick={closeMenus}>HOME</Link></li>

        <li className={`dropdown ${activeDropdown === "view-items" ? "open" : ""}`}>
          <button type="button" className="dropdown-trigger" onClick={() => toggleDropdown("view-items")}>VIEW ITEMS v</button>
          <ul className="dropdown-content">
            <li><Link to="/view-lost" onClick={closeMenus}>Lost Items</Link></li>
            <li><Link to="/view-found" onClick={closeMenus}>Found Items</Link></li>
          </ul>
        </li>

        <li className={`dropdown ${activeDropdown === "post-item" ? "open" : ""}`}>
          <button type="button" className="dropdown-trigger" onClick={() => toggleDropdown("post-item")}>POST ITEM v</button>
          <ul className="dropdown-content">
            <li><Link to="/post-lost-item" onClick={closeMenus}>Report Lost</Link></li>
            <li><Link to="/post-found-item" onClick={closeMenus}>Report Found</Link></li>
          </ul>
        </li>

        <li><Link to="/about-user" onClick={closeMenus}>ABOUT US</Link></li>
        <li><Link to="/contact-user" onClick={closeMenus}>CONTACT US</Link></li>

        <li className="profile-dropdown">
          <FaUserCircle
            className="nav-icon"
            title="Profile"
            onClick={() => setProfileOpen((prev) => !prev)}
          />
          {profileOpen && (
            <ul className="profile-menu">
              <li className="profile-info">
                <strong>{userData.name}</strong><br />
                <span>{userData.email}</span><br />
              </li>
              {!isAdminLoggedIn && (
                <li><Link to="/profile" onClick={closeMenus}>Edit Profile</Link></li>
              )}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
