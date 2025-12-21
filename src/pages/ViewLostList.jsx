import React from "react";
import { useNavigate } from "react-router-dom"; 
import { FaSearch, FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import "./../styles/viewLostlistCss.css";
import lostImage from "../assets/nikeShoe.jpg";

const dummyItems = Array(12).fill({
  title: "Nike Linen Shoe",
  category: "Clothing & Accessories",
  location: "Ampara",
  date: "2025.03.28",
  imageUrl: lostImage,
});

const LostItemsPage = () => {

  const navigate = useNavigate();

  return (
    <div className="lost-items-container">
      <div className="content">
        <h2>Lost Items</h2>


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
                <p className="location"><FaMapMarkerAlt size={11} />{item.location}</p>
                <p className="date">Lost {item.date}</p>
                 <button
                  className="details-btn"
                  onClick={() => navigate("/view-detail-lost")}>View Details</button>
              </div>
            </div>
          ))}
        </div>

        <div className="load-more">Load More</div>
      </div>
    </div>
  );
};

export default LostItemsPage;