// Components/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Optional: install lucide-react for icons

import "../styles/Sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <nav>
                    <ul>
                        <li onClick={toggleSidebar}><Link to="/profile">Profile</Link></li>
                        <li onClick={toggleSidebar}><Link to="/dashboard">Dashboard</Link></li>
                        <li onClick={toggleSidebar}><Link to="/workouts">Workout Plans</Link></li>
                        <li onClick={toggleSidebar}><Link to="/settings">Settings</Link></li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
