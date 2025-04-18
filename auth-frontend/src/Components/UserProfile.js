import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/UserProfile.css";
import profilePicture from "../assets/ProfilePic.jpg"; // Default profile picture

const UserProfile = ({ onLogout, onUpdateProfile }) => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null); // Error state
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null); // Add success state
    const [membershipDetails, setMembershipDetails] = useState(null);
    const [instructorDetails, setInstructorDetails] = useState(null);
    const [showCancelMembership, setShowCancelMembership] = useState(false);
    const [showMembership, setShowMembership] = useState(false);
    const [showCancelEditing, setShowCancelEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
      // membershipType: '',
        profilePicture: '',
        joinDate: ''
    });
    const [originalUserData, setOriginalUserData] = useState(null);

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
                console.log("Fetched user data:", data);
                if (data.membership) {
                    setMembershipDetails(data.membership); // Folosește direct datele din răspuns
                }

                // Fetch instructor
                if (data.instructor) {
                    setInstructorDetails(data.instructor); // Folosește direct datele din răspuns
                }
                console.log("Fetched user data:", data);
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };
        fetchUser();
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "phone" && !phoneRegex.test(value)) {
            setError("Phone number must be 10 digits.");
        } else if (name === "email" && !validateEmail(value)) {
            setError("Please enter a valid email.");
        } else {
            setError(null); // Reset error if input is valid
        }
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
    const phoneRegex = /^[0-9]{10}$/; // Adjust based on your needs

    const handleCancelMembership = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await axios.put(`http://localhost:5017/api/memberships/cancel/${userId}`, null, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // Update UI
            setMembershipDetails(null);
            setUser(prev => ({
                ...prev,
                membership: null,
                membership_Id: null
            }));
            setSuccessMessage("Membership cancelled successfully.");
            setShowMembership(false);
        } catch (error) {
            console.error("Failed to cancel membership", error);
            setError("Failed to cancel membership. Please try again.");
        }
    };
    const changes = () => {
        return (
            formData.name !== user.name ||
            formData.surname !== user.surname ||
            formData.email !== user.email ||
            formData.phone !== user.phone ||
            formData.profilePicture !== (user.photo || profilePicture)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!phoneRegex.test(formData.phone)) {
            setError('Please enter a valid phone number (10 digits).');
            return;
        }
        if (!validateEmail(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }
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

            if (!hasChanges) {
                setSuccessMessage("No changes were made");
                return; // Stay in edit mode
            }

            try {
                const userId = localStorage.getItem("userId");
                const response = await axios.put(
                    `http://localhost:5017/api/user/update/${userId}`,
                    updatedData
                );
                const newUserData = {
                    ...user,
                    name: updatedData.Name,
                    surname: updatedData.Surname,
                    email: updatedData.Email,
                    phone: updatedData.Phone,
                    photo: updatedData.Photo
                };
                setUser(newUserData); // Update user state
                setFormData({
                    ...formData,
                    ...updatedData,
                    profilePicture: updatedData.Photo
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
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const calculateMonthsLeft = (startDate, endDate) => {
        if (!startDate || !endDate) {
            return 0; // Return 0 if any of the dates is null or undefined
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const currentDate = new Date();

        // If the current date is after the end date, return 0 months
        if (currentDate > end) {
            return 0;
        }

        // Calculate the difference in months
        const yearsDifference = end.getFullYear() - currentDate.getFullYear();
        const monthsDifference = end.getMonth() - currentDate.getMonth();
        const totalMonthsLeft = yearsDifference * 12 + monthsDifference;

        return totalMonthsLeft >= 0 ? totalMonthsLeft : 0;
    };

    const monthsLeft = membershipDetails && membershipDetails.endDate
        ? calculateMonthsLeft(membershipDetails.startDate, membershipDetails.endDate)
        : 'No membership';

    if (!user) return <p>Loading profile...</p>;


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
            {showCancelMembership && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <h3>Are you sure you want to cancel this membership?</h3>
                        <p> You still have {monthsLeft} months left</p>
                        <div className="logout-modal-buttons">
                            <button
                                onClick={() => {
                                    handleCancelMembership();
                                    setShowCancelMembership(false);
                                }}
                                className="logout-confirm-btn"
                            >
                                Yes, Cancel it
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
                                Yes, discard changes
                            </button>
                            <button
                                onClick={() => setShowCancelEditing(false)}
                                className="logout-cancel-btn"
                            >
                                No, keep editing
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
                                src={formData.profilePicture || profilePicture}
                                alt="Profile"
                                className="profile-avatar"
                            />
                        </div>
                        <div className="profile-details">
                            <h2>{formData.name + ' ' + formData.surname}</h2>
                            <p><strong>Email:</strong> {formData.email}</p>
                            {/* Aici afisam Membership daca exista */}
                            <p><strong>Membership:</strong> {membershipDetails ? membershipDetails.membershipType : 'None'}</p>
                            <p><strong>Gym Access Join:</strong> {formData.joinDate}</p>
                        </div>
                        <div className="profile-buttons">
                            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>

                            {membershipDetails && (
                                <button className="details-btn" onClick={() => setShowMembership(prev => !prev)}>
                                    {showMembership ? "Hide Membership Details" : "See Membership Details"}
                                </button>
                            )}
                            {!membershipDetails && (
                                <Link to="/memberships">
                                    <button className="details-btn">
                                        Go to Memberships Plan
                                    </button>
                                </Link>
                            ) }
                        </div>

                        {/* Aici adaugam sectiunea de Membership Details */}
                        {showMembership && membershipDetails && (
                            <div className="membership-card">
                                <h3>Membership Details</h3>
                                <p><strong>Type:</strong> {membershipDetails.membershipType}</p>
                                <p><strong>Price:</strong> ${membershipDetails.price}</p>
                                <p><strong>Start Date:</strong> {membershipDetails.startDate ? membershipDetails.startDate.split('T')[0] : ''}</p>
                                <p><strong>End Date:</strong> {membershipDetails.endDate ? membershipDetails.endDate.split('T')[0] : ''}</p>

                                {/* Aici afisam Instructorul */}
                                {instructorDetails && (
                                    <><p><strong>Instructor:</strong> {instructorDetails.instructorName}</p><p><strong>Instructor Email:</strong> {instructorDetails.instructorEmail}</p><p><strong>Instructor Phone:</strong> {instructorDetails.instructorPhone}</p></>
                                )}
                                <button
                                    className="cancel-membership-btn"
                                    onClick={()=>setShowCancelMembership(true)}
                                >
                                    Cancel Membership
                                </button>
                            </div>
                        )}

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
                                        if (changes()) {
                                            setShowCancelEditing(true)
                                        }
                                        else {
                                            setIsEditing(false)
                                        }
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

export default UserProfile;
