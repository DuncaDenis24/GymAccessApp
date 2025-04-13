﻿import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import UserProfile from './Components/UserProfile';
import Background from './Components/BackGround';
import Sidebar from './Components/Sidebar';

import Dashboard from './Components/Dashboard';
import Settings from './Components/Settings';
import MembershipPlans from './Components/MembershipPlans';

const App = () => {
    const [user, setUser] = useState(null);

    // 👇 Load from localStorage on app start
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // 👈 Save user
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const handleUpdateProfile = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // 👈 Keep updated
    };

    return (
        <Router>
            {user && <Sidebar />}
            {!user && <Background />}

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
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
                <Route path="/memberships" element={user ? <MembershipPlans /> : <Navigate to="/" replace />} />
                <Route path="/settings" element={user ? <Settings /> : <Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
