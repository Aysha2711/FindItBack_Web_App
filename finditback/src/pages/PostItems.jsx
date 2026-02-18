


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaArrowLeft, FaTrash } from "react-icons/fa";
import "./../styles/postItemsCss.css";
import ViewMyPost from "./viewMyPost";
import { useFeedback } from "../context/FeedbackContext";
// Fallback images
import nikeShoe from "../assets/nikeShoe.jpg";
import pinkBag from "../assets/pinkbag.jpg";

const PostItems = () => {
    const navigate = useNavigate();
    const { notify, confirmAction } = useFeedback();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchUserItems = async () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/items/user/${userId}`);
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
            console.error("Error fetching items:", error);
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
        fetchUserItems();
    }, [navigate]);


    const handleDelete = async (e, item) => {
        e.stopPropagation(); // Prevent card click if any
        if (!(await confirmAction("Are you sure you want to delete this post?"))) return;

        try {
            const endpoint = item.type === "LOST ITEM" ? `/lost/${item.id}` : `/found/${item.id}`;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/items${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setItems(items.filter(i => i.id !== item.id || i.type !== item.type));
                notify("Post deleted successfully.");
            } else {
                notify("Failed to delete the post.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            notify("Error deleting post.");
        }
    };

    if (loading) return <div className="claim-container"><h2>Loading your posts...</h2></div>;

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        return (
            <div className="claim-container">
                <header className="claim-header">
                    <h1 className="claim-header-title">My Posts</h1>
                    <p className="claim-header-subtitle">Session required.</p>
                </header>
                <div className="no-posts">
                    <h3 style={{ color: '#d32f2f' }}>Error: User ID not found.</h3>
                    <p>Please log out and log in again to sync your posts.</p>
                    <button className="review-btn" style={{ width: '200px', marginTop: '20px' }} onClick={() => navigate("/")}>Go to Login</button>
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
                <h1 className="claim-header-title">My Posts</h1>
                <p className="claim-header-subtitle">Here are the items you have posted.</p>
            </header>

            {items.length === 0 ? (
                <div className="no-posts">
                    <h3>You haven't posted any items yet.</h3>
                </div>
            ) : (
                items.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="item-cards">
                        {/* Delete Icon */}
                        <FaTrash
                            className="delete-icon"
                            title="Delete Post"
                            onClick={(e) => handleDelete(e, item)}
                        />

                        {/* Left: Image Side */}
                        <div className="image-section">
                            <img
                                src={item.image ? `http://localhost:5000/${item.image.replace(/\\/g, '/')}` : (item.type === "LOST ITEM" ? nikeShoe : pinkBag)}
                                alt={item.name}
                                className="item-img"
                                onError={(e) => { e.target.onerror = null; e.target.src = item.type === "LOST ITEM" ? nikeShoe : pinkBag; }}
                            />
                            <button
                                className="review-btn"
                                onClick={() => {
                                    setSelectedItem(item);
                                }}
                            >
                                View
                            </button>

                        </div>

                        {/* Right: Info Side */}
                        <div className="info-section">
                            <span className={`status-badge ${item.typeClass}`}>{item.type}</span>
                            <h3 className="item-title">{item.name}</h3>

                            <div className="details-list">
                                <p>
                                    <FaTag className="icon" />
                                    <span><strong>Category:</strong> {item.category}</span>
                                </p>
                                <p>
                                    <FaCalendarAlt className="icon" />
                                    <span><strong>Date:</strong> {item.date}</span>
                                </p>
                                <p>
                                    <FaMapMarkerAlt className="icon" />
                                    <span><strong>Area:</strong> {item.area}</span>
                                </p>
                                <p>
                                    <FaPen className="icon" />
                                    <span className="description-text">{item.description}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {selectedItem && (
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
                        <ViewMyPost item={selectedItem} onClose={() => setSelectedItem(null)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostItems;


