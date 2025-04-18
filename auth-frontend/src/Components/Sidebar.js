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
            </div>
        </>
    );
};

export default Sidebar;
