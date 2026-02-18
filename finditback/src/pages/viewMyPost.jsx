import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBox, FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaPhone, FaImage, FaTimes } from "react-icons/fa";
import "../styles/PostlostitemCss.css";

const ViewMyPost = ({ item: itemProp, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const item = itemProp || location.state?.item;

    const handleClose = () => {
        if (onClose) {
            onClose();
            return;
        }
        navigate("/post-items");
    };

    if (!item) {
        return (
            <div className="post-lost-container">
                <h2>Post not found</h2>
                <button className="submit-btn" onClick={() => navigate("/post-items")}>
                    Back to My Posts
                </button>
            </div>
        );
    }

    const isLost = item.type === "LOST ITEM";

    return (
        <div className="post-lost-container" style={{ position: "relative" }}>
            <button className="modal-close-btn" onClick={handleClose} aria-label="Close popup">
                <FaTimes />
            </button>

            <h1 className="title">{isLost ? "View My Lost Report" : "View My Found Report"}</h1>
            <p className="subtitle">Review the details you provided for this item.</p>

            <div className="lost-form">
                <section className="form-section">
                    <h2>Public Details</h2>
                    <h6>These fields are visible to everyone on the public lists.</h6>

                    <label>
                        <FaBox /> Item Name
                        <input type="text" value={item.name} readOnly />
                    </label>

                    <label>
                        <FaTag /> Category
                        <input type="text" value={item.category} readOnly />
                    </label>

                    <label>
                        <FaCalendarAlt /> Date
                        <input type="text" value={item.date} readOnly />
                    </label>

                    <label>
                        <FaMapMarkerAlt /> Area
                        <input type="text" value={item.area} readOnly />
                    </label>

                    <label>
                        <FaImage /> Uploaded Image
                        <div className="view-image-box">
                            {item.image ? (
                                <img
                                    src={`http://localhost:5000/${item.image.replace(/\\/g, "/")}`}
                                    alt={item.name}
                                    style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "8px" }}
                                />
                            ) : (
                                <p>No image provided</p>
                            )}
                        </div>
                    </label>

                    <label>
                        <FaPen /> Description
                        <textarea value={item.description} readOnly style={{ minHeight: "100px" }} />
                    </label>
                </section>

                <section className="form-section">
                    <h2>Private Details</h2>
                    <h6>This information is private and only visible to you and administrators.</h6>

                    <label>
                        <FaMapMarkerAlt /> Exact Location
                        <input type="text" value={item.exact_location || "N/A"} readOnly />
                    </label>

                    <label>
                        <FaPhone /> Contact Information
                        <input type="text" value={item.contact_info} readOnly />
                    </label>

                    <label>
                        <FaPen /> Notes for Admin
                        <textarea value={item.admin_notes || "No extra notes."} readOnly style={{ minHeight: "80px" }} />
                    </label>

                    <label>
                        <FaTag /> Status
                        <input
                            type="text"
                            value={item.status}
                            readOnly
                            style={{ fontWeight: "bold", color: item.status === "Pending" ? "#ef4444" : "#22c55e" }}
                        />
                    </label>
                </section>

                <div className="btn" style={{ marginTop: "20px" }}>
                    <button className="submit-btn" onClick={handleClose}>Back to My Posts</button>
                </div>
            </div>
        </div>
    );
};

export default ViewMyPost;


