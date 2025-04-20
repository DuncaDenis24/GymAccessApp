import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import "../styles/Sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [role, setRole] = useState(null);
    const sidebarRef = useRef(null); // Reference for the sidebar container
    const toggleButtonRef = useRef(null); // Reference for the toggle button

    const toggleSidebar = () => {
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);

        // Function to handle click outside the sidebar
        const handleClickOutside = (event) => {
            // Close sidebar if the click is outside the sidebar container and not on the toggle button
            if (
                sidebarRef.current && !sidebarRef.current.contains(event.target) &&
                !toggleButtonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        // Attach the event listener to detect clicks outside the sidebar
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close sidebar when a link is clicked
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            <div
                className="sidebar-toggle"
                onClick={toggleSidebar}
                ref={toggleButtonRef} // Reference for the toggle button
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </div>
            <div>
            <div className={`sidebar ${isOpen ? 'open' : ''}`} ref={sidebarRef}>
                <nav>
                    <ul>
                        {/* Instructor-only links */}
                        {role === "instructor" && (
                            <>
                                <li>
                                    <Link to="/instructor-profile" onClick={handleLinkClick}>Profile</Link>
                                </li>
                                <li>
                                    <Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/InstructorsClients" onClick={handleLinkClick}>Clients</Link>
                                </li>
                            </>
                        )}

                        {/* User-only link */}
                        {role === "user" && (
                            <>
                                <li>
                                    <Link to="/profile" onClick={handleLinkClick}>Profile</Link>
                                </li>

                                <li>
                                    <Link to="/memberships" onClick={handleLinkClick}>Membership Plans</Link>
                                </li>
                                <li>
                                    <Link to="/facilities" onClick={handleLinkClick}>Facilities</Link>
                                </li>
                            </>
                        )}

                        <li>
                            <Link to="/settings" onClick={handleLinkClick}>Settings</Link>
                        </li>
                    </ul>
                </nav>
                <div class="rotating-icon">
                    <svg viewBox="0 0 50 50">
                        <path d="M25 5 L45 15 L45 35 L25 45 L5 35 L5 15 Z M25 10 L10 18 L10 32 L25 40 L40 32 L40 18 Z" fill="#fff" />
                        <path d="M15 18 L35 32 M35 18 L15 32" stroke="#f44336" stroke-width="2" />
                    </svg>
                    </div>
                    <div className="sidebar-footer">
                        <p>&copy; 2025 Gym Access App</p>
                        <p>All rights reserved.</p>
                        <p>Developed by Mircea, Denis, Flaviu and Vero</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
