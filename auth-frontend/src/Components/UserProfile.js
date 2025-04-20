import React, { useState, useEffect, Profiler } from 'react';
import axios from 'axios';
import "../styles/UserProfile.css";
import profilePicture from "../assets/ProfilePic.jpg"; // Default profile picture

const UserProfile = ({ onLogout, onUpdateProfile }) => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null); // Error state
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null); // Add success state

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
      // membershipType: '',
        profilePicture: '',
        joinDate: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const res = await axios.get(`https://localhost:7253/api/user/get/${userId}`);
                const data = res.data;


                setUser({
                    ...data,
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    phone: data.phone,
                    photo: data.photo
                }); 
                setFormData({
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    phone: data.phone,
                    profilePicture: data.photo || profilePicture,
                    joinDate: data.joinDate ? data.joinDate.split('T')[0] : ''
                });
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };
        fetchUser();
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
            Name: formData.name,
            Surname: formData.surname,
            Email: formData.email,
            Phone: formData.phone,
            Photo: formData.profilePicture
        };
            // Check for changes before API call
            const hasChanges =
                formData.name !== user.name ||
                formData.surname !== user.surname ||
                formData.email !== user.email ||
                formData.phone !== user.phone ||
                formData.profilePicture !== (user.photo || profilePicture);

            await axios.put(
                `http://localhost:5017/api/user/update/${userId}`,
                updatedData
            );

            // Update user state
            setUser({
                ...user,
                name: updatedData.Name,
                surname: updatedData.Surname,
                email: updatedData.Email,
                phone: updatedData.Phone,
                photo: updatedData.Photo
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


    if (!user) return <p>Loading profile...</p>;

        if (currentDate > end) return 0;

        const yearsDifference = end.getFullYear() - currentDate.getFullYear();
        const monthsDifference = end.getMonth() - currentDate.getMonth();
        const totalMonthsLeft = yearsDifference * 12 + monthsDifference;

        return totalMonthsLeft >= 0 ? totalMonthsLeft : 0;
    };

    // Handle membership cancellation
    const handleCancelMembership = async () => {
        try {
            const userId = localStorage.getItem("userId");
            await axios.put(`http://localhost:5017/api/memberships/cancel/${userId}`, null, {
                headers: { 'Content-Type': 'application/json' }
            });

            setMembershipDetails(null);
            setUser(prev => ({ ...prev, membership: null }));
            setNotification({ type: 'success', message: "Membership cancelled successfully" });
            setShowMembership(false);
        } catch (error) {
            console.error("Failed to cancel membership", error);
            setNotification({ type: 'error', message: "Failed to cancel membership" });
        }
    };

    const monthsLeft = membershipDetails && membershipDetails.endDate
        ? calculateMonthsLeft(membershipDetails.startDate, membershipDetails.endDate)
        : 0;

    if (!user) return <div className="loading-container">Loading profile...</div>;

    return (
        <div className="profile-container">
            {showLogoutConfirm && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <h3>Are you sure you want to log out?</h3>
                        <div className="logout-modal-buttons">
                            <button
                                onClick={() => {
                                    onLogout();
                                    setShowLogoutConfirm(false);
                                }}
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
                <h1>My Gym Profile</h1>
                <div className="logout-btn-container">
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="logout-btn"
                    >
                        Log Out
                    </button>
                </div>
                </div>
            
            <div className="profile-content">
                <div className="message-container">
                    {error && (
                        <div className="notification error-notification fade-out">
                            <span className="notification-icon">⚠️</span>
                            <span>{typeof error === 'object' ? JSON.stringify(error) : error}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className={`notification fade-out ${successMessage === "No changes were made"
                                ? "info-notification"
                                : "success-notification"
                            }`}>
                            <span className="notification-icon">
                                {successMessage === "No changes were made" ? "ℹ️" : "✓"}
                            </span>
                            <span>{successMessage}</span>
                        </div>
                    )}
                </div>
                {!isEditing ? (
                    <div className="profile-view">
                        <div className="avatar-section">
                            <img
                                src={formData.profilePicture || 'Select Image'}
                                alt="Profile"
                                className="profile-avatar"
                            />
                        </div>
                        <div className="profile-details">
                            <h2>{formData.name + ' ' + formData.surname}</h2>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Membership:</strong> {'None'}</p>
                            <p><strong>Member Since:</strong> {formData.joinDate}</p>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
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
                            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
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

export default UserProfile;
