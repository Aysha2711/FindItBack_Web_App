import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaEye,
  FaPlusCircle,
  FaList,
  FaClipboardCheck,
  FaStar,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaTags,
  FaClock,
  FaBoxOpen,
  FaChevronDown
} from "react-icons/fa";
import "./../styles/userdashboardCss.css";
import { useNavigate } from "react-router-dom";
import dashboardImage from "../assets/userDash1.jpg";
import illustration from "../assets/userdash2.png";

const UserDashboard = () => {

    const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">

        <aside className="sidebar">
          <ul>
            <li>
              <FaTachometerAlt /> Dashboard
            </li>

        
            <li onClick={() => toggleDropdown("viewItems")} className="dropdown-header">
              <FaEye /> View Items <FaChevronDown className="chevron" />
            </li>
            {openDropdown === "viewItems" && (
              <ul className="dropdown-menu">
                <li onClick={() => navigate("/view-lost")}>View Lost</li>
                <li onClick={() => navigate("/view-found")}>View Found</li>
              </ul>
            )}

            <li onClick={() => toggleDropdown("postItems")} className="dropdown-header">
              <FaPlusCircle /> Post Item <FaChevronDown className="chevron" />
            </li>
            {openDropdown === "postItems" && (
              <ul className="dropdown-menu">
                <li onClick={() => navigate("/post-lost-item")}>Report Lost</li>
                <li onClick={() => navigate("/post-found-item")}>Report Found</li>
              </ul>
            )}

            <li onClick={() => navigate("/my-post")}> 
              <FaList /> My Posts
            </li>
            <li onClick={() => navigate("/claim-request")}>
              <FaClipboardCheck /> Claim Request
            </li>
            <li onClick={() => navigate("/review")}>
              <FaStar /> Reviews
            </li>
            <li onClick={() => navigate("/notify")}>
              <FaBell /> Notification
            </li>
            <li onClick={() => navigate("/coming-soon")}>
              <FaCog /> Setting
            </li>
            <li onClick={() => navigate("/")}>
              <FaSignOutAlt /> Logout
            </li>
          </ul>
        </aside>

        {/* Content */}
        <section className="dashboard-content">
          <div
            className="welcome-box"
            style={{ backgroundImage: `url(${dashboardImage})` }}
          >
            <h2>Hello John!</h2>
            <p>
              Manage your posts, respond to claim requests, and help items find
              their rightful owners. Let’s make a difference together!
            </p>
          </div>


          <div className="stats-row">
            <div className="stat-card">
              <FaTags className="stat-icon" />
              <h3>2</h3>
              <p>My Posts</p>
            </div>
            <div className="stat-card">
              <FaClock className="stat-icon" />
              <h3>1</h3>
              <p>Pending Claims</p>
            </div>
            <div className="stat-card">
              <FaBoxOpen className="stat-icon" />
              <h3>1</h3>
              <p>Claim Request</p>
            </div>
          </div>


          <div className="action-buttons">
            <button className="report-btn" onClick={() => navigate("/post-lost-item")}>REPORT LOST ITEM</button>
            <button className="report-btn" onClick={() => navigate("/post-found-item")}>REPORT FOUND ITEM</button>
          </div>

          <div className="illustration">
            <img src={illustration} alt="illustration" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
