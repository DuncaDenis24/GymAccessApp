import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import UserProfile from './Components/UserProfile';
import Background from './Components/BackGround';

const App = () => {
    const [user, setUser] = useState(null);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    const handleUpdateProfile = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    return (
        <Router>
            {user === null && <Background />}  {/* Only show Background if user is not logged in */}

            <Routes>
                <Route      
                    path="/"
                    element={
                        user ? (
                            <Navigate to="/profile" replace />
                        ) : (
                            <Login onLoginSuccess={handleLoginSuccess} />
                        )
                    }
                />
                <Route
                    path="/profile"
                    element={
                        user ? (
                            <UserProfile
                                user={user}
                                onLogout={handleLogout}
                                onUpdateProfile={handleUpdateProfile}
                            />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
