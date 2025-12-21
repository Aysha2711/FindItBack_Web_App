import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./../styles/HomepageCss.css";
import walletImg from "../assets/wallet.jpg";
import CmnNavbar from "../components/cmnNavbar";
import Footer from "../components/Footer";


const HomePage = () => {
  const navigate = useNavigate(); 

  return (
    
    <div className="homepage">
      <CmnNavbar />
     
      <div className="hero" style={{ backgroundImage: `url(${walletImg})` }}>
        <h1>
          FindItBack connects people who lose and find things <br /> across your
          community.
        </h1>
        <div className="search-box">
          <input type="text" placeholder="Search Item..." />
          <button>🔍</button>
        </div>
        <div className="action-buttons">
          <div>
            <p>Lost Something?</p>
            <button
              className="report-btn"
              onClick={() => navigate("/login")}
            >
              REPORT LOST ITEM
            </button>
          </div>
          <div>
            <p>Found Something?</p>
            <button
              className="report-btn"
              onClick={() => navigate("/login")}
            >
              REPORT FOUND ITEM
            </button>
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h2>✔️ 1,250+</h2>
          <p>Items Found</p>
        </div>
        <div className="stat-card">
          <h2>🙌 3,000+</h2>      {/*unicode emoji characters*/ }
          <p>Users Helped</p>
        </div>
        <div className="stat-card">
          <h2>🏀 50+</h2>
          <p>Communities Trusted</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
