import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import UserProfile from './Components/UserProfile';
import Background from './Components/BackGround';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import Settings from './Components/Settings';
import MembershipPlans from './Components/MembershipPlans';
import InstructorProfile from './Components/InstructorProfile';
import InstructorsClients from './Components/InstructorsClients'
import Facilities from './Components/Facilities';

const App = () => {
    const [user, setUser] = useState(null);
    //localStorage.removeItem("user");
    
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); 
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const handleUpdateProfile = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); 
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
                            user.role === "instructor" ? (
                                <Navigate to="/instructor-profile" replace />
                            ) : (
                                <Navigate to="/profile" replace />
                            )
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
                <Route
                    path="/instructor-profile"
                    element={
                        user ? (
                            user.role === "instructor" ? (
                                <InstructorProfile
                                    user={user}
                                    onLogout={handleLogout}
                                    onUpdateProfile={handleUpdateProfile}
                                />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/dashboard" replace />} />
                <Route path="/memberships" element={user ? <MembershipPlans /> : <Navigate to="/memberships" replace />} />
                <Route path="/settings" element={user ? <Settings /> : <Navigate to="/settings" replace />} />
                <Route path="/instructorsclients" element={user ? <InstructorsClients /> : <Navigate to="/instructorsclients" replace />} />
                <Route path="/facilities" element={user? <Facilities/> :<Navigate to="/facilities" replace/> } />
            </Routes>
        </Router>
    );
};

export default App;
