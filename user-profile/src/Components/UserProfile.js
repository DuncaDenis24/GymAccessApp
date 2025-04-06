import React, { useState } from 'react';
import "../styles/UserProfile.css";


const UserProfile = ({ user, onLogout, onUpdateProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        membershipType: user.membershipType,
        profilePicture: user.profilePicture
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateProfile(formData);
        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Gym Profile</h1>
                <button onClick={onLogout} className="logout-btn">
                    Logout
                </button>
            </div>

            <div className="profile-content">
                {!isEditing ? (
                    <div className="profile-view">
                        <div className="avatar-section">
                            <img
                                src={user.profilePicture || 'https://via.placeholder.com/150'}
                                alt="Profile"
                                className="profile-avatar"
                            />
                        </div>
                        <div className="profile-details">
                            <h2>{user.name}</h2>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Membership:</strong> {user.membershipType}</p>
                            <p><strong>Member Since:</strong> {new Date(user.joinDate).toLocaleDateString()}</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="edit-btn"
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="profile-edit-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
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
                            <label>Membership Type</label>
                            <select
                                name="membershipType"
                                value={formData.membershipType}
                                onChange={handleInputChange}
                            >
                                <option value="Basic">Basic</option>
                                <option value="Premium">Premium</option>
                                <option value="VIP">VIP</option>
                            </select>
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