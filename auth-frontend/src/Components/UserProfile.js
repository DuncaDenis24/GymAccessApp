import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Notification from './Notification';
import "../styles/UserProfile.css";
import profilePicture from "../assets/ProfilePic.jpg";

const UserProfile = ({ onLogout }) => {
    // State management
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState(null);
    const [membershipDetails, setMembershipDetails] = useState(null);
    const [instructorDetails, setInstructorDetails] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showCancelMembership, setShowCancelMembership] = useState(false);
    const [showMembership, setShowMembership] = useState(false);
    const [showCancelEditing, setShowCancelEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


    // Form data state
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        profilePicture: '',
        joinDate: ''
    });

    // Validation regex
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const res = await axios.get(`http://localhost:5017/api/user/get/${userId}`);
                const data = res.data;

                setUser({
                    ...data,
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    phone: data.phone,
                    photo: data.photo,
                    joinDate: data.joinDate ? data.joinDate.split('T')[0] : ''
                });

                setFormData({
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    phone: data.phone,
                    profilePicture: data.photo || profilePicture,
                    joinDate: data.joinDate ? data.joinDate.split('T')[0] : ''
                });

                if (data.membership) {
                    setMembershipDetails(data.membership);
                }

                if (data.instructor) {
                    setInstructorDetails(data.instructor);
                }

            } catch (err) {
                console.error("Failed to fetch user data", err);
                setNotification({ type: 'error', message: "Failed to load profile data" });
            }
        };
        fetchUser();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Check if form has changes
    const hasChanges = () => {
        return (
            formData.name !== user.name ||
            formData.surname !== user.surname ||
            formData.email !== user.email ||
            formData.phone !== user.phone ||
            formData.profilePicture !== (user.photo || profilePicture)
        );
    };
    const handleDeleteAccount = async () => {
       

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setNotification({ type: "error", message: "User ID not found!" });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5017/api/user/delete/${userId}`, {
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
                setNotification({type: "error", message: "Error deleting account: " + errorData.message});
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            setNotification({ type: "error", message: "An unexpected error occurred." });
        }
    };



    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!phoneRegex.test(formData.phone)) {
            setNotification({ type: 'error', message: "Please enter a valid phone number (10 digits)" });
            return;
        }

        if (!emailRegex.test(formData.email)) {
            setNotification({ type: 'error', message: "Please enter a valid email address" });
            return;
        }

        if (!hasChanges()) {
            setNotification({ type: 'info', message: "No changes were made" });
            return;
        }

        try {
            const userId = localStorage.getItem("userId");
            const updatedData = {
                Name: formData.name,
                Surname: formData.surname,
                Email: formData.email,
                Phone: formData.phone,
                Photo: formData.profilePicture
            };

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

            setNotification({ type: 'success', message: "Profile updated successfully!" });
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed:", error);
            setNotification({
                type: 'error',
                message: error.response?.data?.message || "Failed to update profile"
            });
        }
    };

    // Calculate remaining membership months
    const calculateMonthsLeft = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const currentDate = new Date();

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
            {/* Notification Component */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Logout Confirmation Modal */}
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
            {/* Membership Cancellation Modal */}
            {showCancelMembership && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <h3>Are you sure you want to cancel this membership?</h3>
                        {monthsLeft > 0 && <p>You still have {monthsLeft} months left</p>}
                        <div className="logout-modal-buttons">
                            <button
                                onClick={() => {
                                    handleCancelMembership();
                                    setShowCancelMembership(false);
                                }}
                                className="logout-confirm-btn"
                            >
                                Yes, Cancel It
                            </button>
                            <button
                                onClick={() => setShowCancelMembership(false)}
                                className="logout-cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Editing Modal */}
            {showCancelEditing && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <h3>Are you sure you want to discard changes?</h3>
                        <div className="logout-modal-buttons">
                            <button
                                onClick={() => {
                                    setFormData({
                                        name: user.name,
                                        surname: user.surname,
                                        email: user.email,
                                        phone: user.phone,
                                        profilePicture: user.photo || profilePicture,
                                        joinDate: user.joinDate ? user.joinDate.split('T')[0] : ''
                                    });
                                    setIsEditing(false);
                                    setShowCancelEditing(false);
                                }}
                                className="logout-confirm-btn"
                            >
                                Yes, Discard Changes
                            </button>
                            <button
                                onClick={() => setShowCancelEditing(false)}
                                className="logout-cancel-btn"
                            >
                                No, Keep Editing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Header */}
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

            {/* Profile Content */}
            <div className="profile-content">
                {!isEditing ? (
                    // View Mode
                    <div className="profile-view">
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
                            <p><strong>Membership:</strong> {membershipDetails ? membershipDetails.membershipType : 'None'}</p>
                            <p><strong>Join Date:</strong> {formData.joinDate}</p>
                        </div>
                        <div className="profile-buttons">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="edit-btn"
                            >
                                Edit Profile
                            </button>

                            {membershipDetails ? (
                                <button
                                    className="details-btn"
                                    onClick={() => setShowMembership(!showMembership)}
                                >
                                    {showMembership ? "Hide Details" : "Show Membership"}
                                </button>
                            ) : (
                                <Link to="/memberships">
                                    <button className="details-btn">
                                        Get Membership
                                    </button>
                                </Link>
                            )}
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="delete-btn"
                            > Delete Account
                            </button>
                        </div>


                        {/* Membership Details Section */}
                        {showMembership && membershipDetails && (
                            <div className="membership-card">
                                <h3>Membership Details</h3>
                                <p><strong>Type:</strong> {membershipDetails.membershipType}</p>
                                <p><strong>Price:</strong> ${membershipDetails.price}</p>
                                <p><strong>Start Date:</strong> {membershipDetails.startDate.split('T')[0]}</p>
                                <p><strong>End Date:</strong> {membershipDetails.endDate.split('T')[0]}</p>
                                <p><strong>Time Remaining:</strong> {monthsLeft} months</p>

                                {instructorDetails && (
                                    <>
                                        <h4>Your Instructor</h4>
                                        <p><strong>Name:</strong> {instructorDetails.instructorName}</p>
                                        <p><strong>Email:</strong> {instructorDetails.instructorEmail}</p>
                                        <p><strong>Phone:</strong> {instructorDetails.instructorPhone}</p>
                                    </>
                                )}

                                <button
                                    className="cancel-membership-btn"
                                    onClick={() => setShowCancelMembership(true)}
                                >
                                    Cancel Membership
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Edit Mode
                    <form onSubmit={handleSubmit} className="profile-edit-form">
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

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => hasChanges() ? setShowCancelEditing(true) : setIsEditing(false)}
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

export default UserProfile;