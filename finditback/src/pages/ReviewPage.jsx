import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaMapMarkerAlt, FaCalendarAlt, FaPen, FaUser, FaImage, FaTimes } from "react-icons/fa";
import "./../styles/verificationfoundCss.css";
import { useFeedback } from "../context/FeedbackContext";

const ReviewPage = ({ claim: claimProp, onClose, onStatusUpdated }) => {
    const navigate = useNavigate();
    const { notify } = useFeedback();
    const location = useLocation();
    const claim = claimProp || location.state?.claim;

    const handleClose = () => {
        if (onClose) {
            onClose();
            return;
        }
        navigate("/reviews");
    };

    if (!claim) {
        return (
            <div className="claim-verification-page">
                <h2 className="title">Claim not found</h2>
                <button className="accept" style={{ marginTop: "20px" }} onClick={() => navigate("/reviews")}>
                    Back to Reviews
                </button>
            </div>
        );
    }

    const item = claim.item_details;
    const isLostItemClaim = claim.type === "LOST ITEM";

    const handleStatusUpdate = async (newStatus) => {
        const endpoint = claim.type === "LOST ITEM"
            ? `http://localhost:5000/api/items/verify-lost/${claim.id}/status`
            : `http://localhost:5000/api/items/verify-found/${claim.id}/status`;

        try {
            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                notify(`Claim ${newStatus} successfully!`);
                if (onStatusUpdated) {
                    onStatusUpdated(newStatus);
                }
                handleClose();
            } else {
                notify("Failed to update claim status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            notify("Error updating status.");
        }
    };

    return (
        <div className="vf-wrapper">
            <div className="vf-container" style={{ position: "relative" }}>
                <div className="verify-header">
                    <h2 className="title" style={{ margin: 0 }}>Review Claim</h2>
                    <button className="modal-close-btn" onClick={handleClose} aria-label="Close popup">
                        <FaTimes />
                    </button>
                </div>

                <p className="subtitle" style={{ textAlign: "center", marginBottom: "20px" }}>
                    Verify details provided by the claimant for your item: <strong>{item?.name}</strong>
                </p>

                <div className="note">
                    <p><FaShieldAlt /> Carefully review these answers to determine if the claimant is the rightful owner or the actual finder.</p>
                </div>

                <div className="lost-form">
                    <section className="form-section">
                        <div style={{ marginBottom: "20px", padding: "15px", background: "#e0f2fe", borderRadius: "8px", border: "1px solid #bae6fd" }}>
                            <h4 style={{ margin: "0 0 10px 0", color: "#0369a1" }}><FaUser /> Claimant Information</h4>
                            <p style={{ margin: "5px 0" }}><strong>Name:</strong> {claim.claimant_details?.name || claim.full_name || "Anonymous"}</p>
                            <p style={{ margin: "5px 0" }}><strong>Email:</strong> {claim.claimant_details?.email || "Not available"}</p>
                        </div>

                        <h4>Claimant&apos;s Answers</h4>

                        {isLostItemClaim ? (
                            <>
                                <label>
                                    <FaMapMarkerAlt /> Where they found it
                                    <input type="text" value={claim.found_location} readOnly />
                                </label>
                                <label>
                                    <FaCalendarAlt /> Date and Time found
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
                                    <FaMapMarkerAlt /> Where they lost it
                                    <input type="text" value={claim.lost_location} readOnly />
                                </label>
                                <label>
                                    <FaCalendarAlt /> Date and Time lost
                                    <input type="text" value={claim.lost_date} readOnly />
                                </label>
                            </>
                        )}

                        <label>
                            <FaPen /> Distinguishing features they described
                            <textarea value={claim.features || "No features described"} readOnly />
                        </label>

                        <label>
                            <FaImage /> Proof Image submitted
                            <div className="view-image-box">
                                {claim.proof_image ? (
                                    <img
                                        src={`http://localhost:5000/${claim.proof_image.replace(/\\/g, "/")}`}
                                        alt="Proof"
                                        style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "8px", border: "1px solid #ddd" }}
                                    />
                                ) : (
                                    <p style={{ padding: "20px", background: "#f5f5f5", borderRadius: "8px", textAlign: "center" }}>No proof image provided</p>
                                )}
                            </div>
                        </label>

                        <label>
                            <FaPen /> Their story
                            <textarea value={claim.story || "No story provided"} readOnly />
                        </label>
                    </section>
                </div>

                <div className="decision-card" style={{ marginTop: "30px", padding: "20px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
                    <h4 style={{ textAlign: "center", marginBottom: "15px" }}>Your Decision</h4>
                    <div className="buttons1" style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                        <button
                            className="accept"
                            style={{ padding: "12px 30px", fontSize: "1rem" }}
                            onClick={() => handleStatusUpdate("Accepted")}
                            disabled={claim.status !== "Pending"}
                        >
                            Accept Claim
                        </button>
                        <button
                            className="reject"
                            style={{ padding: "12px 30px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" }}
                            onClick={() => handleStatusUpdate("Rejected")}
                            disabled={claim.status !== "Pending"}
                        >
                            Reject Claim
                        </button>
                    </div>
                    {claim.status !== "Pending" && (
                        <p style={{ textAlign: "center", marginTop: "10px", color: "#666" }}>
                            This claim has already been <strong>{claim.status}</strong>.
                        </p>
                    )}
                </div>

                <div className="btn" style={{ marginTop: "20px", textAlign: "center" }}>
                    <button className="submit-btn" style={{ background: "#64748b" }} onClick={handleClose}>Back to Reviews</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;


