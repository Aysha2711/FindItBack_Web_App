import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaSave, FaPhone } from "react-icons/fa";
import "../styles/profilePageCss.css";
import { useFeedback } from "../context/FeedbackContext";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { notify } = useFeedback();
    const userId = sessionStorage.getItem('userId');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    // Store original data to detect changes
    const [initialData, setInitialData] = useState({
        name: "",
        email: "",
        phone_number: ""
    });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (!userId || userId === 'null' || userId === 'undefined') {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            const isAdmin = sessionStorage.getItem('isAdminLoggedIn') === 'true' && !userId;
            if (isAdmin) {
                notify("Admins do not have an editable profile here.");
                navigate("/admin-dash");
                return;
            }

            try {
                const token = sessionStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log("Fetched User Data from API:", data);

                if (response.ok) {
                    if (data.phone_number === undefined) {
                        console.error("DEBUG: phone_number field is missing from API response!");
                    }
                    const userValues = {
                        name: data.name,
                        email: data.email,
                        phone_number: data.phone_number || ""
                    };
                    setInitialData(userValues);
                    setFormData(prev => ({
                        ...prev,
                        ...userValues
                    }));
                } else {
                    notify(`Failed to fetch user data (Status: ${response.status})`);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                notify("Network error: Could not connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const updatePayload = {};
        let hasChanges = false;

        // Compare personal info with initial data
        if (formData.name !== initialData.name) {
            updatePayload.name = formData.name;
            hasChanges = true;
        }
        if (formData.email !== initialData.email) {
            updatePayload.email = formData.email;
            hasChanges = true;
        }
        if (formData.phone_number !== initialData.phone_number) {
            updatePayload.phone_number = formData.phone_number;
            hasChanges = true;
        }

        // Handle password change
        if (showPasswordSection && formData.password) {
            if (formData.password !== formData.confirmPassword) {
                notify("Passwords do not match!");
                return;
            }
            if (formData.password.length < 6) {
                notify("Password must be at least 6 characters long");
                return;
            }
            updatePayload.password = formData.password;
            hasChanges = true;
        }

        if (!hasChanges) {
            notify("No changes detected.");
            return;
        }

        setSaving(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatePayload)
            });

            if (response.ok) {
                const result = await response.json();
                notify("Profile updated successfully!");

                // Update initial state to new values
                setInitialData({
                    name: result.user.name,
                    email: result.user.email,
                    phone_number: result.user.phone_number || ""
                });

                sessionStorage.setItem('userName', result.user.name);
                sessionStorage.setItem('userEmail', result.user.email || '');

                if (showPasswordSection) {
                    setShowPasswordSection(false);
                    setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
                }
            } else {
                const errorData = await response.json();
                notify(errorData.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            notify("Error updating profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="profile-loading">Loading...</div>;

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <div className="profile-header">
                    <button className="back-btn" onClick={() => navigate("/user-dash")}>
                        <FaArrowLeft />
                    </button>
                    <h2>My Profile</h2>
                    <div className="placeholder-div"></div>
                </div>

                <form className="profile-form" onSubmit={handleUpdateProfile}>
                    <div className="form-section">
                        <h3>Personal Information</h3>
                        <div className="input-group">
                            <label><FaUser /> Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label><FaEnvelope /> Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label><FaPhone /> Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    <div className="password-toggle-section">
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                        >
                            <FaLock /> {showPasswordSection ? "Cancel Password Reset" : "Reset Password"}
                        </button>
                    </div>

                    {showPasswordSection && (
                        <div className="form-section password-section animate-fade">
                            <h3>Reset Password</h3>
                            <div className="input-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="input-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    )}

                    <div className="profile-actions">
                        <button type="submit" className="save-btn" disabled={saving}>
                            {saving ? "Saving..." : <><FaSave /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;




