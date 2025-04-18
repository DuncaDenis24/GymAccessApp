import React from 'react';
import '../styles/NoClients.css';

const NoClients = () => {
    return (
        <div className="no-clients-container">
           
            <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No clients"
                className="no-clients-img"
            />
            <h3 className="no-clients-subtitle">No clients yet</h3>
            <p className="no-clients-text">
                Once users choose you as their instructor, they will appear here.
            </p>
        </div>
    );
};

export default NoClients;
