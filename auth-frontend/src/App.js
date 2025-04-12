import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import UserProfile from './Components/UserProfile';
import Background from './Components/BackGround';
import Sidebar from './Components/Sidebar';

import Dashboard from './Components/Dashboard';
import WorkoutPlans from './Components/WorkoutPlans';
import Settings from './Components/Settings';

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
                <Route path="/workouts" element={user ? <WorkoutPlans /> : <Navigate to="/" replace />} />
                <Route path="/settings" element={user ? <Settings /> : <Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
