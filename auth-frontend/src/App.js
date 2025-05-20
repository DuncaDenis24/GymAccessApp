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
import AdminProfile from './Components/AdminProfile';
import AdminMemberships from './Components/AdminMembership';
import AdminFacilities from './Components/AdminFacilities';
import AdminUserInstructors from './Components/AdminUserInstructors';
import AdminManageInstructors from './Components/AdminManageInstructors';

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
                                    user.role === "user" ? (
                                <Navigate to="/profile" replace />
                                    ) : (
                                            <Navigate to="/admin-profile" replace />
                                    )
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
                <Route
                    path="/admin-profile"
                    element={
                        user ? (
                            user.role === "admin" ? (
                                <AdminProfile
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
                <Route path="/admin-memberships" element={user ? <AdminMemberships /> : <Navigate to="/admin-memberships" replace />} />"
                <Route path="/settings" element={user ? <Settings /> : <Navigate to="/settings" replace />} />
                <Route path="/instructorsclients" element={user ? <InstructorsClients /> : <Navigate to="/instructorsclients" replace />} />
                <Route path="/facilities" element={user? <Facilities/> :<Navigate to="/facilities" replace/> } />
                <Route path="/admin-facilities" element={user ? <AdminFacilities /> : <Navigate to="/admin-facilities" replace />} />
                <Route path="/admin/user-instructors" element={user ? <AdminUserInstructors /> : <Navigate to="/admin/user-instructors" replace />} />
                <Route path="/admin/managment-instructors" element={user ? <AdminManageInstructors /> : <Navigate to="/admin/managment-instructors" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
