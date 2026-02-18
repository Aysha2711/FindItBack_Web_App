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
  const [userName, setUserName] = useState(sessionStorage.getItem('userName') || "User");
  const [stats, setStats] = useState({
    myPosts: 0,
    pendingClaims: 0,
    claimRequests: 0
  });



  const navigate = useNavigate();

  React.useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userId = sessionStorage.getItem('userId');
    if (!isLoggedIn || !userId || userId === 'null' || userId === 'undefined') {
      navigate("/login");
      return;
    }

    // Fetch user details from DB
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.name);
          sessionStorage.setItem('userName', userData.name); // Sync storage
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch dashboard stats from DB
    const fetchUserStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/items/user-stats/${userId}`);
        if (response.ok) {
          const statsData = await response.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserData();
    fetchUserStats();
  }, [navigate]);




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

            <li onClick={() => navigate("/post-items")}>
              <FaList /> My Posts
            </li>
            <li onClick={() => navigate("/claim-request")}>
              <FaClipboardCheck /> Claim Request
            </li>
            <li onClick={() => navigate("/reviews")}>
              <FaStar /> Reviews
            </li>

            {/* <li onClick={() => navigate("/coming-soon")}>
              <FaBell /> Notification
            </li>
            <li onClick={() => navigate("/profile")}>
              <FaCog /> Setting
            </li> */}
            <li onClick={() => {
              sessionStorage.removeItem('isLoggedIn');
              sessionStorage.removeItem('userId');
              sessionStorage.removeItem('token'); // Clear token
              sessionStorage.removeItem('isAdminLoggedIn');
              sessionStorage.removeItem('isAdminMode');
              sessionStorage.removeItem('adminToken');
              navigate("/");
            }}>
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
            <h2>Hello {userName}!</h2>

            <p>
              Manage your posts, respond to claim requests, and help items find
              their rightful owners. Let’s make a difference together!
            </p>
          </div>


          <div className="stats-row">
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate("/post-items")}>
              <FaTags className="stat-icon" />
              <h3>{stats.myPosts}</h3>
              <p>My Posts</p>
            </div>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate("/reviews")}>
              <FaClock className="stat-icon" />
              <h3>{stats.pendingClaims}</h3>
              <p>Pending Claims</p>
            </div>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate("/claim-request")}>
              <FaBoxOpen className="stat-icon" />
              <h3>{stats.claimRequests}</h3>
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



