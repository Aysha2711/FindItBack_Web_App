import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./../styles/cmnnavbarCss.css";
import logoImg from "../assets/logo1.jpg";
import { FaToggleOn } from "react-icons/fa";

const CmnNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");
  const isUserLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const isAdminLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
  const loginRoute = isUserLoggedIn ? "/user-dash" : (isAdminLoggedIn ? "/admin-dash" : "/login");
  const canPostItems = isUserLoggedIn || isAdminMode || isAdminLoggedIn;

  useEffect(() => {
    const adminMode = sessionStorage.getItem("isAdminMode") === "true";
    setIsAdminMode(adminMode);
  }, [location]);

  const closeMenus = () => {
    setIsOpen(false);
    setActiveDropdown("");
  };

  const toggleDropdown = (key) => {
    setActiveDropdown((prev) => (prev === key ? "" : key));
  };

  const handleAdminToggle = () => {
    if (isAdminMode) {
      sessionStorage.setItem("isAdminMode", "false");
      navigate("/admin-dash");
    }
  };

  return (
    <nav className="navbar cmn-navbar">
      <div className="logo-container">
        <Link to="/" onClick={closeMenus}>
          <img src={logoImg} alt="FindItBack logo" className="navbar-logo" />
        </Link>
      </div>

      <button type="button" className="menu-toggle" onClick={() => setIsOpen((prev) => !prev)} aria-label="Toggle menu">
        {"\u2630"}
      </button>

      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={closeMenus}>HOME</Link></li>

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
            <li><Link to={canPostItems ? "/post-lost-item" : "/login"} onClick={closeMenus}>Report Lost</Link></li>
            <li><Link to={canPostItems ? "/post-found-item" : "/login"} onClick={closeMenus}>Report Found</Link></li>
          </ul>
        </li>

        <li><Link to="/about" onClick={closeMenus}>ABOUT US</Link></li>
        <li><Link to="/contact" onClick={closeMenus}>CONTACT US</Link></li>

        {isAdminMode && (
          <li className="admin-toggle-nav">
            <div className="nav-admin-toggle" onClick={handleAdminToggle}>
              <span>User</span>
              <div className="nav-toggle-switch">
                <FaToggleOn className="toggle-icon" />
              </div>
              <span className="active">Admin</span>
            </div>
          </li>
        )}

        {!isAdminMode && (
          <li>
            <Link to={loginRoute} onClick={closeMenus}>
              <button className="login-btnnn">LOGIN</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default CmnNavbar;
