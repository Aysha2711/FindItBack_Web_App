import React from "react";
import { useNavigate } from "react-router-dom"; 
import { FaSearch, FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import "./../styles/viewFoundListCss.css";
import pinkBagImg from "./../assets/pinkbag.jpg";


const dummyItems = Array(12).fill({
  title: "Pink Side Bag",
  category: "Bags & Wallets",
  location: "Gampaha",
  date: "2025.05.15",
  imageUrl: pinkBagImg,
});

const FoundItemsPage = () => {

  const navigate = useNavigate();

  return (
    <div className="found-items-container">


      <div className="content">
        <h2>Found Items</h2>

        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <input type="text" placeholder="Search Item..." />
            <FaSearch className="search-icon" />
          </div>

          <div className="dropdowns">
            <select><option>Category</option></select>
            <select><option>Found area</option></select>
            <select><option>Date</option></select>
            <button className="plus-btn"><FaPlus /></button>
          </div>
        </div>

        <div className="items-grid">
          {dummyItems.map((item, index) => (
            <div className="item-card" key={index}>
              <img src={item.imageUrl} alt={item.title} />
              <div className="item-info">
                <h4>{item.title}</h4>
                <p className="category">{item.category}</p>
                <p  className="location"><FaMapMarkerAlt size={11} />{item.location}</p>
                <p className="date">Found {item.date}</p>
                <button
                  className="details-btn"
                  onClick={() => navigate("/view-detail-found")}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="load-more">Load More</div>
      </div>

    </div>
  );
};

export default FoundItemsPage;
