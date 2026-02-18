import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaArrowLeft, FaTrash, FaUser } from "react-icons/fa";
import ViewMyClaim from "./viewMyClaim";
import { useFeedback } from "../context/FeedbackContext";

import "./../styles/claimRequestCss.css";
// Replace these with your actual local paths
import nikeShoe from "../assets/nikeShoe.jpg";
import pinkBag from "../assets/pinkbag.jpg";

const ClaimRequest = () => {
    const navigate = useNavigate();
    const { notify, confirmAction } = useFeedback();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        if (!userId || userId === 'null' || userId === 'undefined') {
            navigate("/login");
        }
    }, [userId, navigate]);

    const fetchUserClaims = async () => {
        const currentUserId = sessionStorage.getItem('userId');
        if (!currentUserId || currentUserId === 'null' || currentUserId === 'undefined') {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/items/user-claims/${currentUserId}`);
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
            console.error("Error fetching claims:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUserClaims();
    }, []);

    const handleDelete = async (e, item) => {
        e.stopPropagation();
        if (!(await confirmAction("Are you sure you want to cancel this claim request?"))) return;

        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                notify("Your session expired. Please login again.");
                navigate("/login");
                return;
            }

            const endpoint = item.type === "LOST ITEM" ? `/verify-lost/${item.id}` : `/verify-found/${item.id}`;
            const response = await fetch(`http://localhost:5000/api/items${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setItems(prevItems => prevItems.filter(i => i.id !== item.id || i.type !== item.type));
                notify("Claim request cancelled.");
            } else if (response.status === 401 || response.status === 403) {
                notify("Your session expired. Please login again.");
                navigate("/login");
            } else {
                notify("Failed to cancel claim request.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            notify("Error cancelling claim request.");
        }
    };

    if (loading) return <div className="claim-container"><h2>Loading your claims...</h2></div>;


    if (!userId || userId === 'null' || userId === 'undefined') {
        return null; // The useEffect will handle redirect
    }


    return (
        <div className="claim-container">
            <div className="back-btn-container">
                <button className="back-arrow-btn" onClick={() => navigate("/user-dash")}>
                    <FaArrowLeft />
                </button>
            </div>
            <header className="claim-header">
                <h1 className="claim-header-title">My Claim Requests</h1>
                <p className="claim-header-subtitle">Here are the claims you have submitted for items found by others.</p>
            </header>

            {items.length === 0 ? (
                <div className="no-posts" style={{ textAlign: 'center', padding: '50px' }}>
                    <h3>You haven't submitted any claims yet.</h3>
                </div>
            ) : (
                items.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="item-cards">
                        {/* Delete Icon */}
                        <FaTrash
                            className="delete-icon"
                            title="Cancel Claim"
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
                                Requested
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
                                    <FaUser className="icon" /> <strong>Posted By:</strong> {item.posted_by_name || item.owner_details?.name || "Unknown"}
                                </p>
                                <p style={{ fontSize: '14px' }}><strong>Your Claim Status:</strong> <span style={{ color: item.status === 'Accepted' ? '#22c55e' : (item.status === 'Rejected' ? '#ef4444' : '#f59e0b'), fontWeight: 'bold' }}>{item.status}</span></p>

                                {item.status === 'Accepted' && item.owner_details && (
                                    <div className="contact-details-box" style={{ marginTop: '10px', backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                        <h4 style={{ color: '#166534', marginBottom: '5px' }}>✅ Claim Accepted! Contact Owner:</h4>
                                        <p style={{ margin: '3px 0', fontSize: '13px' }}><strong>Name:</strong> {item.owner_details.name}</p>
                                        <p style={{ margin: '3px 0', fontSize: '13px' }}><strong>Email:</strong> {item.owner_details.email}</p>
                                        <p style={{ margin: '3px 0', fontSize: '13px' }}><strong>Phone:</strong> {item.owner_details.phone || 'N/A'}</p>
                                    </div>
                                )}
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
                        <ViewMyClaim claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
                    </div>
                </div>
            )}
        </div>

    );
};

export default ClaimRequest;


