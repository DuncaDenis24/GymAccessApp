import React, { useState } from 'react';
import UserProfile from './Components/UserProfile.js';
import './App.css';

function App() {
    const [user, setUser] = useState({
        name: "John Doe",
        email: "john@example.com",
        membershipType: "Premium",
        profilePicture: "",
        joinDate: "2023-01-15"
    });

    const handleLogout = () => {
        // Replace with your actual logout logic
        console.log("User logged out");
        alert("Logged out successfully!");
    };

    const handleUpdateProfile = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
        alert("Profile updated successfully!");
    };

    return (
        <div className="App">
            <UserProfile
                user={user}
                onLogout={handleLogout}
                onUpdateProfile={handleUpdateProfile}
            />
        </div>
    );
}

export default App;