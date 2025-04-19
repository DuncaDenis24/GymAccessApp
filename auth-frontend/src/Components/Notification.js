import React, { useEffect } from 'react';
import '../styles/Notification.css'; // We'll create this

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    return (
        <div className={`notification ${type}-notification`}>
            <span className="notification-icon">
                {type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️'}
            </span>
            <span>{message}</span>
        </div>
    );
};

export default Notification;