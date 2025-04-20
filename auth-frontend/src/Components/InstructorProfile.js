import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/UserProfile.css";
import profilePicture from "../assets/ProfilePic.jpg";
import Notification from "./Notification"; // Import the Notification component

const InstructorProfile = ({ onLogout }) => {
    const [instructor, setInstructor] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        profilePicture: ""
    });
    const [notification, setNotification] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showCancelEditing, setShowCancelEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [clientCount, setClientCount] = useState(0); // Initialize client count

    useEffect(() => {
        const fetchData = async () => {
            try {
                const instructorId = localStorage.getItem("userId"); // or instructorId if stored separately
                const res = await axios.get(`http://localhost:5017/api/instructors/get/${instructorId}`);
                const data = res.data;

                const clients = await axios.get(`http://localhost:5017/api/instructors/get/${instructorId}/clients/count`);
                const clientsCount = clients.data.clientCount || 0;
                setClientCount(clientsCount); // Set the client count
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
                setIsEditing(false); // Ensure not in edit mode on load
            } catch (err) {
                console.error("Error fetching instructor data:", err);
                setNotification({ type: 'error', message: "Failed to load data." });
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const hasChanges = () => {
        return (
            formData.name !== instructor?.name ||
            formData.surname !== instructor?.surname ||
            formData.email !== instructor?.email ||
            formData.phone !== instructor?.phone ||
            formData.profilePicture !== instructor?.photo
        );
    };
    const handleDeleteAccount = async () => {


        const userId = localStorage.getItem('userId');
        if (!userId) {
            setNotification({ type: "error", message: "User ID not found!" });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5017/api/instructors/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setNotification({ type: "succes", message: "Account deleted successfully." });
                localStorage.clear(); // Clear user data from localStorage
            } else {
                const errorData = await response.json();
                setNotification({ type: "error", message: "Error deleting account: " + errorData.message });
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            setNotification({ type: "error", message: "An unexpected error occurred." });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if there are no changes and show notification
        if (!hasChanges()) {
            setNotification({ type: 'info', message: "No changes were made." });

            // Clear the notification after a brief period
            setTimeout(() => setNotification(null), 3000); // Reset after 3 seconds

            return; // Prevent any further action
        }

        const validName = /^[a-zA-Z]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (!validName.test(formData.name) || !validName.test(formData.surname)) {
            setNotification({ type: 'error', message: "Name and surname can only contain letters." });
            setTimeout(() => setNotification(null), 3000); // Reset after 3 seconds
            return;
        }

        if (!phoneRegex.test(formData.phone)) {
            setNotification({ type: 'error', message: "Phone number must be 10 digits." });
            setTimeout(() => setNotification(null), 3000); // Reset after 3 seconds
            return;
        }

        if (!emailRegex.test(formData.email)) {
            setNotification({ type: 'error', message: "Please enter a valid email address." });
            setTimeout(() => setNotification(null), 3000); // Reset after 3 seconds
            return;
        }

        try {
            const instructorId = localStorage.getItem("userId");
            const updatedData = {
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                phone: formData.phone,
                photo: formData.profilePicture || profilePicture
            };
            await axios.put(
                `http://localhost:5017/api/instructors/update/${instructorId}`,
                updatedData,
                { headers: { "Content-Type": "application/json" } }
            );

            setInstructor({ ...instructor, ...updatedData });
            setNotification({ type: 'success', message: "Profile updated successfully!" });
            setTimeout(() => setNotification(null), 3000); // Reset after 3 seconds
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed:", error);
            setNotification({ type: 'error', message: error.response?.data?.message || "Failed to update profile." });
            setTimeout(() => setNotification(null), 3000); // Reset after 3 seconds
        }
    };


    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirm = () => {
        onLogout();
        setShowLogoutConfirm(false);
    };

    const handleCancelEdit = () => {
        if (hasChanges()) {
            setShowCancelEditing(true);
        } else {
            setIsEditing(false);
        }
    };

    const handleConfirmCancelEdit = () => {
        setFormData({
            name: instructor.name,
            surname: instructor.surname,
            email: instructor.email,
            phone: instructor.phone,
            profilePicture: instructor.photo || profilePicture
        });
        setIsEditing(false);
        setShowCancelEditing(false);
    };

    if (!instructor) return <div className="loading-container">Loading profile...</div>;

    return (
        <div className="profile-page">
            <div className="profile-container body-profile">
                <div className="dumbbell-float"></div>
                <div className="dumbbell-float"></div>
                <div className="dumbbell-float"></div>
                <div className="dumbbell-float"></div>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {showLogoutConfirm && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <h3>Are you sure you want to log out?</h3>
                        <div className="logout-modal-buttons">
                            <button onClick={handleLogoutConfirm} className="logout-confirm-btn">
                                Yes, Log Out
                            </button>
                            <button onClick={() => setShowLogoutConfirm(false)} className="logout-cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteConfirm && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <h3>Are you sure you want to delete this account?</h3>
                        <div className="logout-modal-buttons">
                            <button
                                onClick={() => {
                                    handleDeleteAccount();
                                    onLogout();
                                    setShowDeleteConfirm(false);
                                }}
                                className="logout-confirm-btn"
                            >
                                Yes, Delete Acount
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="logout-cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showCancelEditing && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <h3>Are you sure you want to discard changes?</h3>
                        <div className="logout-modal-buttons">
                            <button onClick={handleConfirmCancelEdit} className="logout-confirm-btn">
                                Yes, Discard Changes
                            </button>
                            <button onClick={() => setShowCancelEditing(false)} className="logout-cancel-btn">
                                No, Keep Editing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="profile-header">
                <h1>Instructor Profile</h1>
                <div className="logout-btn-container">
                    <button onClick={handleLogout} className="logout-btn">
                        Log Out
                    </button>
                </div>
            </div>

                <div className="profile-content">
                    <AnimatePresence mode="wait">
                        {!isEditing ? (
                            // View Mode - Animated
                            <motion.div
                                key="view-mode"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.8 }}
                                className="profile-view"
                            >
                                {/* View mode content remains the same */}
                                <div className="avatar-section">
                                    <img
                                        src={formData.profilePicture || profilePicture}
                                        alt="Profile"
                                        className="profile-avatar"
                                    />
                                </div>
                                <div className="profile-details">
                                    <h2>{`${formData.name} ${formData.surname}`}</h2>
                                    <p><strong>Email:</strong> {formData.email}</p>
                                    <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
                                    <p><strong>Clients:</strong> {clientCount}</p>
                                </div>
                                <div className="profile-buttons">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="edit-btn"
                                    >
                                        Edit Profile
                                    </button>

                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="delete-btn"
                                    >
                                        Delete Account
                                    </button>
                        </div>
                            </motion.div>
                        ) : (
                            <motion.form
                                    key="edit-mode"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleSubmit}
                                    className="profile-edit-form"
                                >

                     <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
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
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="10-digit number"
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
                                <div>
                                    <button type="submit" className="save-btn">
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => hasChanges() ? setShowCancelEditing(true) : setIsEditing(false)}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.form>
                        )}
                </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default InstructorProfile;