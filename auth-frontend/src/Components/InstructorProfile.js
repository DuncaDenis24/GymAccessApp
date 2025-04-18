import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserProfile.css";
import profilePicture from "../assets/ProfilePic.jpg"; // Default profile picture

const InstructorProfile = ({ onLogout, onUpdateProfile }) => {
    const [instructor, setInstructor] = useState(null);
    const [clientsCount, setClientsCount] = useState(0); // Store the number of clients
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null); // Error state
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null); // Add success state

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        profilePicture: '',
    });

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const instructorId = localStorage.getItem("userId");

                const instructorRes = await axios.get(`http://localhost:5017/api/instructors/get/${instructorId}`);
                const data = instructorRes.data;

                setInstructor({
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    phone: data.phone,
                    photo: data.photo || profilePicture
                });

                setFormData({
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    phone: data.phone,
                    profilePicture: data.photo || profilePicture
                });

                // Fetch the number of clients
                const clientsCountRes = await axios.get(`http://localhost:5017/api/instructors/get/${instructorId}/clients/count`);
                setClientsCount(clientsCountRes.data.clientCount);

            } catch (err) {
                console.error("Error fetching instructor data or clients:", err);
                setError("Failed to load data.");
            }
        };

        fetchInstructorData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        let timer;
        if (successMessage) {
            timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);
        }
        return () => clearTimeout(timer); // Cleanup on unmount
    }, [successMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        const updatedData = {
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            phone: formData.phone,
            photo: formData.profilePicture || profilePicture
        };

        // Check for changes before API call
        const hasChanges =
            formData.name !== instructor.name ||
            formData.surname !== instructor.surname ||
            formData.email !== instructor.email ||
            formData.phone !== instructor.phone ||
            formData.profilePicture !== instructor.photo;

        if (!hasChanges) {
            setSuccessMessage("No changes were made");
            return; // Stay in edit mode
        }

        try {
            const instructorId = localStorage.getItem("userId");
            const response = await axios.put(
                `http://localhost:5017/api/instructors/update/${instructorId}`,
                updatedData,
                { headers: { "Content-Type": "application/json" } }
            );
            const newInstructorData = {
                ...instructor,
                name: updatedData.name,
                surname: updatedData.surname,
                email: updatedData.email,
                phone: updatedData.phone,
                photo: updatedData.photo
            };
            setInstructor(newInstructorData);
            setFormData({
                ...formData,
                ...updatedData,
                profilePicture: updatedData.photo
            });

            setSuccessMessage("Changes saved successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed:", error);
            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to update profile. Please try again."
            );
        }
    };

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirm = () => {
        onLogout();
        setShowLogoutConfirm(false);
    };

    if (!instructor) return <p>Loading profile...</p>;

    return (
        <div className="profile-container">
            {showLogoutConfirm && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <h3>Are you sure you want to log out?</h3>
                        <div className="logout-modal-buttons">
                            <button
                                onClick={handleLogoutConfirm}
                                className="logout-confirm-btn"
                            >
                                Yes, Log Out
                            </button>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="logout-cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="profile-header">
                <h1>Instructor Profile</h1>
                <div className="logout-btn-container">
                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Log Out
                    </button>
                </div>
            </div>

            <div className="message-container">
                {error && (
                    <div className="notification error-notification fade-out">
                        <span className="notification-icon">⚠️</span>
                        <span>{typeof error === 'object' ? JSON.stringify(error) : error}</span>
                    </div>
                )}
                {successMessage && (
                    <div className={`notification fade-out ${successMessage === "No changes were made" ? "info-notification" : "success-notification"}`}>
                        <span className="notification-icon">
                            {successMessage === "No changes were made" ? "ℹ️" : "✓"}
                        </span>
                        <span>{successMessage}</span>
                    </div>
                )}
            </div>

            <div className="profile-content">
                {!isEditing ? (
                    <div className="profile-view">
                        <div className="avatar-section">
                            <img
                                src={formData.profilePicture || profilePicture}
                                alt="Profile"
                                className="profile-avatar"
                            />
                        </div>
                        <div className="profile-details">
                            <h2>{formData.name + ' ' + formData.surname}</h2>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Phone:</strong> {formData.phone}</p>
                            <p><strong>Clients:</strong> {clientsCount}</p> {/* Display client count */}
                            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="profile-edit-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Surname</label>
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Profile Picture URL</label>
                            <input
                                type="url"
                                name="profilePicture"
                                value={formData.profilePicture}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({
                                            name: instructor.name,
                                            surname: instructor.surname,
                                            email: instructor.email,
                                            phone: instructor.phone,
                                            profilePicture: instructor.photo || profilePicture,
                                        });
                                        setIsEditing(false);
                                    }}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            <button type="submit" className="save-btn">
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default InstructorProfile;
