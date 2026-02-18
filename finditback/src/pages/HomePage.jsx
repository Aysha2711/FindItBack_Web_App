import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/HomepageCss.css";
import "./../styles/viewFoundListCss.css";
import walletImg from "../assets/wallet.jpg";
import CmnNavbar from "../components/cmnNavbar";
import Footer from "../components/Footer";
import pinkBagImg from "../assets/pinkbag.jpg";
import nikeShoeImg from "../assets/nikeShoe.jpg";
import { FaMapMarkerAlt } from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();
  const isUserLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const isAdminMode = sessionStorage.getItem("isAdminMode") === "true";
  const isAdminLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
  const canPostItems = isUserLoggedIn || isAdminMode || isAdminLoggedIn;
  const [allFoundItems, setAllFoundItems] = useState([]);
  const [allLostItems, setAllLostItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const sortByRecent = (items) => {
      const getTime = (item) => {
        const stamp = item.created_at || item.createdAt || item.updated_at || item.updatedAt || item.date;
        const parsed = new Date(stamp).getTime();
        if (!Number.isNaN(parsed) && parsed > 0) {
          return parsed;
        }
        return Number(item.id) || 0;
      };

      return [...items].sort((a, b) => getTime(b) - getTime(a));
    };

    const fetchHomeItems = async () => {
      try {
        const [foundRes, lostRes] = await Promise.all([
          fetch("http://localhost:5000/api/items/found"),
          fetch("http://localhost:5000/api/items/lost")
        ]);

        if (foundRes.ok) {
          const foundData = await foundRes.json();
          setAllFoundItems(sortByRecent(foundData));
        }

        if (lostRes.ok) {
          const lostData = await lostRes.json();
          setAllLostItems(sortByRecent(lostData));
        }
      } catch (error) {
        console.error("Error fetching home items:", error);
      }
    };

    fetchHomeItems();
  }, []);

  const query = searchText.trim().toLowerCase();
  const isSearching = showSearchResults && query.length > 0;
  const matchItem = (item) =>
    (item.name || "").toLowerCase().includes(query) ||
    (item.category || "").toLowerCase().includes(query) ||
    (item.area || "").toLowerCase().includes(query) ||
    (item.description || "").toLowerCase().includes(query);

  const foundItemsToRender = isSearching
    ? allFoundItems.filter(matchItem)
    : allFoundItems.slice(0, 4);
  const lostItemsToRender = isSearching
    ? allLostItems.filter(matchItem)
    : allLostItems.slice(0, 4);

  const handleDirectSearch = () => {
    if (query.length === 0) {
      setShowSearchResults(false);
      return;
    }
    setShowSearchResults(true);
  };

  return (
    <div className="homepage">
      <CmnNavbar />

      <div className="hero" style={{ backgroundImage: `url(${walletImg})` }}>
        <h1>
          FindItBack connects people who lose and find things <br /> across your
          community.
        </h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Item..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleDirectSearch();
            }}
          />
          <button onClick={handleDirectSearch}>Search</button>
        </div>
        <div className="hero-search-actions">
          <button onClick={() => navigate("/view-found", { state: { searchQuery: searchText } })}>
            Search in Found
          </button>
          <button onClick={() => navigate("/view-lost", { state: { searchQuery: searchText } })}>
            Search in Lost
          </button>
        </div>
        <div className="action-buttons">
          <div>
            <p>Lost Something?</p>
            <button
              className="report-btn"
              onClick={() => {
                navigate(canPostItems ? "/post-lost-item" : "/login");
              }}
            >
              REPORT LOST ITEM
            </button>
          </div>
          <div>
            <p>Found Something?</p>
            <button
              className="report-btn"
              onClick={() => {
                navigate(canPostItems ? "/post-found-item" : "/login");
              }}
            >
              REPORT FOUND ITEM
            </button>
          </div>
        </div>
      </div>

      <div className="home-items-wrapper">
        <section className="home-items-section found-group">
          <div className="home-items-header">
            <h2>{isSearching ? "Found Items - Search Results" : "Found Items"}</h2>
          </div>
          <div className="home-items-grid">
            {foundItemsToRender.map((item) => (
              <div className="item-card" key={`found-${item.id}`}>
                <img
                  src={item.image ? `http://localhost:5000/${item.image.replace(/\\/g, "/")}` : pinkBagImg}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = pinkBagImg;
                  }}
                />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="category">{item.category}</p>
                  <p className="location"><FaMapMarkerAlt size={11} />{item.area}</p>
                  <p className="date">Found {item.date}</p>
                </div>
              </div>
            ))}
          </div>
          {isSearching && foundItemsToRender.length === 0 && (
            <p className="home-empty-text">No found items matched your search.</p>
          )}
          <button className="home-view-more" onClick={() => navigate("/view-found")}>
            View More
          </button>
        </section>

        <section className="home-items-section lost-group">
          <div className="home-items-header">
            <h2>{isSearching ? "Lost Items - Search Results" : "Lost Items"}</h2>
          </div>
          <div className="home-items-grid">
            {lostItemsToRender.map((item) => (
              <div className="item-card" key={`lost-${item.id}`}>
                <img
                  src={item.image ? `http://localhost:5000/${item.image.replace(/\\/g, "/")}` : nikeShoeImg}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = nikeShoeImg;
                  }}
                />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="category">{item.category}</p>
                  <p className="location"><FaMapMarkerAlt size={11} />{item.area}</p>
                  <p className="date">Lost {item.date}</p>
                </div>
              </div>
            ))}
          </div>
          {isSearching && lostItemsToRender.length === 0 && (
            <p className="home-empty-text">No lost items matched your search.</p>
          )}
          <button className="home-view-more" onClick={() => navigate("/view-lost")}>
            View More
          </button>
        </section>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h2>✅ 1250+</h2>
          <p>Items Found</p>
        </div>
        <div className="stat-card">
          <h2>🙌 3000+</h2>
          <p>Users Helped</p>
        </div>
        <div className="stat-card">
          <h2>🏆 50+</h2>
          <p>Communities Trusted</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;


