import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaArrowLeft, FaTrash, FaUser } from "react-icons/fa";
import ReviewPage from "./ReviewPage";
import { useFeedback } from "../context/FeedbackContext";

import "./../styles/reviewCss.css";
// Replace these with your actual local paths
import nikeShoe from "../assets/nikeShoe.jpg";
import pinkBag from "../assets/pinkbag.jpg";

const Reviews = () => {
    const navigate = useNavigate();
    const { notify, confirmAction } = useFeedback();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState(null);

    const fetchReceivedClaims = async () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/items/received-claims/${userId}`);
            if (response.ok) {
                const data = await response.json();
                const sortedData = [...data].sort((a, b) => {
                    const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
                    const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
                    if (timeA !== timeB) return timeB - timeA;
                    return (b.id || 0) - (a.id || 0);
                });
                setItems(sortedData);
            }
        } catch (error) {
            console.error("Error fetching received claims:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        if (!userId || userId === 'null' || userId === 'undefined') {
            navigate("/login");
            return;
        }
        fetchReceivedClaims();
    }, [navigate]);


    const handleDelete = async (e, item) => {
        e.stopPropagation();
        if (!(await confirmAction("Are you sure you want to dismiss this claim?"))) return;

        try {
            const endpoint = item.type === "LOST ITEM" ? `/verify-lost/${item.id}` : `/verify-found/${item.id}`;
            const response = await fetch(`http://localhost:5000/api/items${endpoint}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setItems(items.filter(i => i.id !== item.id || i.type !== item.type));
                notify("Claim dismissed successfully.");
            } else {
                notify("Failed to dismiss claim.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            notify("Error dismissing claim.");
        }
    };


    if (loading) return <div className="claim-container"><h2>Loading received claims...</h2></div>;


    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        return (
            <div className="claim-container">
                <header className="claim-header">
                    <h1 className="claim-header-title">Check Pending Claims</h1>
                    <p className="claim-header-subtitle">Session required.</p>
                </header>
                <div className="no-posts" style={{ textAlign: 'center', padding: '50px' }}>
                    <h3 style={{ color: '#d32f2f' }}>Error: User ID not found.</h3>
                    <p>Please log out and log in again.</p>
                    <button className="review-btn" style={{ width: '200px', marginTop: '20px', alignSelf: 'center' }} onClick={() => navigate("/")}>Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="claim-container">
            <div className="back-btn-container">
                <button className="back-arrow-btn" onClick={() => navigate("/user-dash")}>
                    <FaArrowLeft />
                </button>
            </div>
            <header className="claim-header">
                <h1 className="claim-header-title">Claims to Review</h1>
                <p className="claim-header-subtitle">Review and verify claim requests submitted by others for your items.</p>
            </header>

            {items.length === 0 ? (
                <div className="no-posts" style={{ textAlign: 'center', padding: '50px' }}>
                    <h3>No pending claims for your items.</h3>
                </div>
            ) : (
                items.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="item-cards">
                        {/* Delete Icon */}
                        <FaTrash
                            className="delete-icon"
                            title="Dismiss Claim"
                            onClick={(e) => handleDelete(e, item)}
                        />

                        {/* Left: Image Side */}
                        <div className="image-section">
                            <img
                                src={item.item_details?.image ? `http://localhost:5000/${item.item_details.image.replace(/\\/g, '/')}` : (item.type === "LOST ITEM" ? nikeShoe : pinkBag)}
                                alt={item.item_details?.name}
                                className="item-img"
                                onError={(e) => { e.target.onerror = null; e.target.src = item.type === "LOST ITEM" ? nikeShoe : pinkBag; }}
                            />
                            <button
                                className="review-btn"
                                onClick={() => {
                                    setSelectedClaim(item);
                                }}
                            >
                                Review
                            </button>
                        </div>

                        {/* Right: Info Side */}
                        <div className="info-section">
                            <span className={`status-badge ${item.typeClass}`}>{item.type}</span>
                            <h3 className="item-title">{item.item_details?.name || "Unknown Item"}</h3>

                            <div className="details-list">
                                <p>
                                    <FaTag className="icon" />
                                    <span><strong>Category:</strong> {item.item_details?.category || "N/A"}</span>
                                </p>
                                <p>
                                    <FaCalendarAlt className="icon" />
                                    <span><strong>Date:</strong> {item.item_details?.date || "N/A"}</span>
                                </p>
                                <p>
                                    <FaMapMarkerAlt className="icon" />
                                    <span><strong>Area:</strong> {item.item_details?.area || "N/A"}</span>
                                </p>
                                <p>
                                    <FaPen className="icon" />
                                    <span className="description-text">{item.item_details?.description || "No description provided."}</span>
                                </p>
                            </div>
                            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                <p style={{ fontSize: '14px', marginBottom: '6px' }}>
                                    <FaUser className="icon" /> <strong>Requested By:</strong> {item.requested_by_name || item.claimant_details?.name || item.full_name || "Unknown"}
                                </p>
                                <p style={{ fontSize: '14px' }}><strong>Claim Status:</strong> <span style={{ color: item.status === 'Pending' ? '#ef4444' : (item.status === 'Accepted' ? '#22c55e' : '#64748b'), fontWeight: 'bold' }}>{item.status}</span></p>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {selectedClaim && (
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
                        <ReviewPage
                            claim={selectedClaim}
                            onClose={() => setSelectedClaim(null)}
                            onStatusUpdated={() => fetchReceivedClaims()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;


