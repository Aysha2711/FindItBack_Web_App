import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaLock, FaShieldAlt } from "react-icons/fa";
import "../styles/viewdetailedlostCss.css";
import bagImage from "../assets/nikeShoe.jpg";
import VerificationFormFoundItem from "./verifyFormFound";
import { useFeedback } from "../context/FeedbackContext";

const ItemDetailLostView = () => {

  const navigate = useNavigate();
  const { notify } = useFeedback();
  const location = useLocation();
  const item = location.state?.item;

  const [relatedItems, setRelatedItems] = React.useState([]);
  const [showClaimPopup, setShowClaimPopup] = React.useState(false);

  React.useEffect(() => {
    if (item && item.category) {
      fetch("http://localhost:5000/api/items/lost")
        .then(res => res.json())
        .then(data => {
          // Filter by category and exclude the current item
          const filtered = data
            .filter(i => i.category === item.category && i.id !== item.id)
            .slice(0, 5);
          setRelatedItems(filtered);
        })
        .catch(err => console.error("Error fetching related items:", err));
    }
  }, [item]);

  if (!item) {
    return <div className="item-detail-page"><h2>Item not found</h2><Link to="/view-lost">Back to Lost Items</Link></div>;
  }

  return (
    <div className="item-detail-page">

      <Link to="/view-lost" className="back-link">
        <FaArrowLeft /> Back to Lost Items
      </Link>


      <div className="item-detail-main">

        <div className="item-image-section">
          <img
            src={item.image ? `http://localhost:5000/${item.image.replace(/\\/g, '/')}` : bagImage}
            alt={item.name}
            className="lost-item-image"
            onError={(e) => { e.target.onerror = null; e.target.src = bagImage; }}
          />
          <div className="claim-section">
            <p className="claim-text">Have you found this item?</p>
            {sessionStorage.getItem('userId') === String(item.user_id) ? (
              <div className="owner-status-box" style={{ padding: '15px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#166534', fontWeight: '500' }}>You are the owner of this post.</p>
                <button className="claim-btn" style={{ marginTop: '10px', background: '#64748b' }} onClick={() => navigate("/post-items")}>Manage My Posts</button>
              </div>
            ) : (
              <>
                <button
                  className="claim-btn"
                  onClick={() => {
                    if (sessionStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isAdminLoggedIn') === 'true') {
                      setShowClaimPopup(true);
                    } else {
                      notify("You must login to submit a claim.");
                      navigate("/login");
                    }
                  }}>Submit Claim</button>
                <p className="claim-note">You’ll be asked to answer a few questions to confirm ownership.</p>
              </>
            )}

          </div>
        </div>


        <div className="item-info-section">
          <span className="lost-label">LOST ITEM</span>
          <h2>{item.name}</h2>
          <ul className="item-info-list">
            <li><FaTag /> Category: {item.category}</li>
            <li><FaCalendarAlt /> Date Lost: {item.date}</li>
            <li><FaMapMarkerAlt /> Area: {item.area}</li>
            <li><FaPen />
              <p>{item.description}</p>
            </li>

          </ul>
          <div className="info-box">
            <p><FaLock /> This post doesn't display exact found location or contact details. These will be shared only upon valid claim.</p>
            <p><FaShieldAlt /> In case of valuable items, any unique features may have been hidden from the item image.</p>
          </div>
        </div>
      </div>


      {relatedItems.length > 0 && (
        <div className="other-items-section">
          <h3>Other Items</h3>
          <div className="other-items-list">
            {relatedItems.map((rItem, index) => (
              <div className="item-card" key={index}>
                <img
                  src={rItem.image ? `http://localhost:5000/${rItem.image.replace(/\\/g, '/')}` : bagImage}
                  alt={rItem.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = bagImage; }}
                />
                <p className="item-title">{rItem.name}</p>
                <p className="item-meta">{rItem.category} • {rItem.area}</p>
                <p className="item-date">Lost {rItem.date}</p>
                <button
                  className="view-btn"
                  onClick={() => {
                    navigate("/view-detail-lost", { state: { item: rItem } });
                    window.scrollTo(0, 0);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
          <button
            className="view-more-link"
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
            onClick={() => navigate("/view-lost", { state: { category: item.category } })}
          >
            View More →
          </button>
        </div>
      )}

      {showClaimPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "20px",
            overflow: "hidden"
          }}
        >
          <div
            className="modal-popup-shell"
            style={{
              width: "100%",
              maxWidth: "980px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "20px",
              background: "#f3f4f6",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.22)"
            }}
          >
            <VerificationFormFoundItem item={item} onClose={() => setShowClaimPopup(false)} />
          </div>
        </div>
      )}

    </div>
  );
};

export default ItemDetailLostView;


