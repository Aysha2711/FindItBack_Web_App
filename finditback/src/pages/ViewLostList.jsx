import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import "./../styles/viewLostlistCss.css";
import lostImage from "../assets/nikeShoe.jpg";
import { CATEGORY_OPTIONS } from "../constants/categoryOptions";

const LostItemsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = React.useState([]);
  const [visibleCount, setVisibleCount] = React.useState(8);
  const [selectedCategory, setSelectedCategory] = React.useState(location.state?.category || "Category");
  const [searchQuery, setSearchQuery] = React.useState(location.state?.searchQuery || "");
  const [selectedArea, setSelectedArea] = React.useState("Found area");
  const [selectedDate, setSelectedDate] = React.useState("");

  React.useEffect(() => {
    fetch("http://localhost:5000/api/items/lost")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 8);
  };

  return (
    <div className="lost-items-container">
      <div className="content">
        <h2>Lost Items</h2>


        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="dropdowns">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option>Category</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
              <option>Found area</option>
              <option>University of Vavuniya</option>
              <option>Applied Faculty</option>
              <option>BS Faculty</option>
              <option>Library</option>
              <option>Common hall</option>
            </select>
            <input
              type="date"
              className="date-picker-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>
        </div>


        <div className="items-grid">
          {items
            .filter(item => {
              const isAdmin = sessionStorage.getItem('isAdminLoggedIn') === 'true';
              const matchesStatus = item.status !== 'Successful' || isAdmin;
              const matchesCategory = selectedCategory === "Category" || item.category === selectedCategory;
              const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesArea = selectedArea === "Found area" || item.area === selectedArea;
              const matchesDate = selectedDate === "" || item.date === selectedDate;
              return matchesStatus && matchesCategory && matchesSearch && matchesArea && matchesDate;
            })
            .slice(0, visibleCount)
            .map((item, index) => (
              <div className="item-card" key={index}>
                <img
                  src={item.image ? `http://localhost:5000/${item.image.replace(/\\/g, '/')}` : lostImage}
                  alt={item.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = lostImage; }}
                />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="category">{item.category}</p>
                  <p className="location"><FaMapMarkerAlt size={11} />{item.area}</p>
                  <p className="date">Lost {item.date}</p>
                  <button
                    className="details-btn"
                    onClick={() => navigate("/view-detail-lost", { state: { item } })}>View Details</button>
                </div>
              </div>
            ))}
        </div>

        {visibleCount < items.length && (
          <div className="load-more" onClick={handleLoadMore}>Load More</div>
        )}
      </div>
    </div>
  );
};

export default LostItemsPage;


