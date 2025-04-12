import React, { useState, useEffect, Profiler } from 'react';
import axios from 'axios';
import "../styles/UserProfile.css";
import profilePicture from "../assets/ProfilePic.jpg"; // Default profile picture

const UserProfile = ({ onLogout, onUpdateProfile }) => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
       membershipType: '',
        profilePicture: '',
        joinDate: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem("userId"); // or token
                const res = await axios.get(`http://localhost:5017/api/user/get/${userId}`);
                const data = res.data;

                setUser(data);
                setFormData({
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    phone: data.phone,
                    membershipType: data.membershipType || 'None',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem("userId");

            // Map fields properly to match DTO
            const updatedData = {
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                phone: formData.phone,
                photo: formData.profilePicture // backend expects 'photo'
            };

            await axios.put(`http://localhost:5017/api/user/update/${userId}`, updatedData);

            setUser(prev => ({ ...prev, ...updatedData }));
            onUpdateProfile(updatedData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update user profile", error);
        }
    };


    if (!user) return <p>Loading profile...</p>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Gym Profile</h1>
                <button onClick={onLogout} className="logout-btn">Logout</button>
            </div>

            <div className="profile-content">
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
                            <p><strong>Membership:</strong> {formData.membershipType}</p>
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
                            <label>Membership Type</label>
                            <select
                                name="membershipType"
                                value={formData.membershipType}
                                onChange={handleInputChange}
                                >
                                <option value="None">None</option>
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
