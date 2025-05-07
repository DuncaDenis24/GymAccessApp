import React, { useEffect, useState } from 'react';
import '../styles/Facilities.css';
import axios from 'axios';

const Facilities = () => {
    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:7253/api/facilities/get')
            .then(response => setFacilities(response.data))
            .catch(error => console.error('Error fetching facilities:', error));
    }, []);

    return (
        <div className="facilities-container">
            <h1 className="title">Our Gym Facilities</h1>
            <div className="grid">
                {facilities.map((facility) => (
                    <div className="facility-card" key={facility.facilityId}>
                        <img src={facility.imageUrl} alt={facility.title} className="facility-image" />
                        <h2>{facility.title}</h2>
                        <p>{facility.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Facilities;
