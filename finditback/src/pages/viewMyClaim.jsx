import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaShieldAlt, FaImage, FaUser, FaTimes } from "react-icons/fa";
import "../styles/verifyformfoundCss.css";
import pinkBag from "../assets/pinkbag.jpg";
import nikeShoe from "../assets/nikeShoe.jpg";

const ViewMyClaim = ({ claim: claimProp, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const claim = claimProp || location.state?.claim;

    const handleClose = () => {
        if (onClose) {
            onClose();
            return;
        }
        navigate("/claim-request");
    };

    if (!claim) {
        return (
            <div className="vf-wrapper">
                <div className="vf-container">
                    <h2>Claim not found</h2>
                    <button className="submit-btn" onClick={() => navigate("/claim-request")}>
                        Back to Claim Requests
                    </button>
                </div>
            </div>
        );
    }

    const isLostItemClaim = claim.type === "LOST ITEM";
    const item = claim.item_details;

    return (
        <div className="vf-wrapper">
            <div className="vf-container" style={{ position: "relative" }}>
                <button className="modal-close-btn" onClick={handleClose} aria-label="Close popup">
                    <FaTimes />
                </button>
                <h2 className="title">My Claim Details</h2>
                <div className="note" style={{ marginBottom: "24px" }}>
                    <p><FaShieldAlt /> This is the information you submitted to verify your claim. Status: <strong>{claim.status}</strong></p>
                </div>

                {claim.status === "Accepted" && claim.owner_details && (
                    <div
                        className="contact-details-box"
                        style={{ marginBottom: "24px", backgroundColor: "#f0fdf4", padding: "15px", borderRadius: "8px", border: "1px solid #bbf7d0" }}
                    >
                        <h3 style={{ color: "#166534", marginTop: 0, marginBottom: "10px" }}>Claim Accepted!</h3>
                        <p style={{ marginBottom: "10px" }}>The owner has verified your claim. You can now contact them to retrieve your item:</p>
                        <div style={{ paddingLeft: "10px", borderLeft: "3px solid #22c55e" }}>
                            <p style={{ margin: "5px 0" }}><strong>Owner Name:</strong> {claim.owner_details.name}</p>
                            <p style={{ margin: "5px 0" }}><strong>Email:</strong> {claim.owner_details.email}</p>
                            <p style={{ margin: "5px 0" }}><strong>Phone:</strong> {claim.owner_details.phone || "N/A"}</p>
                        </div>
                    </div>
                )}

                <div className="item-card1" style={{ marginBottom: "24px" }}>
                    <img
                        src={item?.image ? `http://localhost:5000/${item.image.replace(/\\/g, "/")}` : (isLostItemClaim ? nikeShoe : pinkBag)}
                        alt={item?.name || "Item"}
                        className="item-image"
                        style={{ width: "260px", maxWidth: "34%", objectFit: "contain" }}
                        onError={(e) => { e.target.onerror = null; e.target.src = isLostItemClaim ? nikeShoe : pinkBag; }}
                    />
                    <div className="item-details1">
                        <span className={claim.typeClass}>{claim.type}</span>
                        <h3>{item?.name || "Unknown Item"}</h3>
                        <p><FaTag /> Category: {item?.category || "N/A"}</p>
                        <p><FaCalendarAlt /> Date: {item?.date || "N/A"}</p>
                        <p><FaMapMarkerAlt /> Area: {item?.area || "N/A"}</p>
                        <p><FaPen /> {item?.description || "No description"}</p>
                    </div>
                </div>

                <div className="lost-form" style={{ marginBottom: "24px" }}>
                    <section className="form-section">
                        {isLostItemClaim ? (
                            <>
                                <label>
                                    <FaMapMarkerAlt /> Where did you find the item?
                                    <input type="text" value={claim.found_location} readOnly />
                                </label>
                                <label>
                                    <FaCalendarAlt /> Found Date and Time
                                    <input type="text" value={claim.found_date} readOnly />
                                </label>
                            </>
                        ) : (
                            <>
                                <label>
                                    <FaUser /> Full Name
                                    <input type="text" value={claim.full_name} readOnly />
                                </label>
                                <label>
                                    <FaMapMarkerAlt /> Where did you lose the item?
                                    <input type="text" value={claim.lost_location} readOnly />
                                </label>
                                <label>
                                    <FaCalendarAlt /> Lost Date and Time
                                    <input type="text" value={claim.lost_date} readOnly />
                                </label>
                            </>
                        )}

                        <label>
                            <FaPen /> Distinguishing features
                            <textarea value={claim.features || "None provided"} readOnly />
                        </label>

                        <label>
                            <FaImage /> Proof Image
                            <div className="view-image-box">
                                {claim.proof_image ? (
                                    <img
                                        src={`http://localhost:5000/${claim.proof_image.replace(/\\/g, "/")}`}
                                        alt="Proof"
                                        style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "8px" }}
                                    />
                                ) : (
                                    <p>No proof image provided</p>
                                )}
                            </div>
                        </label>

                        <label>
                            <FaPen /> Brief story
                            <textarea value={claim.story || "None provided"} readOnly />
                        </label>
                    </section>
                </div>

                <div className="btn" style={{ marginTop: "20px" }}>
                    <button className="submit-btn" onClick={handleClose}>Back to Claim Requests</button>
                </div>
            </div>
        </div>
    );
};

export default ViewMyClaim;


