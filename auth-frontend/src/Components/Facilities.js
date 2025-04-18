import React from 'react';
import '../styles/Facilities.css';
import cardio from '../assets/cardio.jpg';
import weights from '../assets/weights.jpg';
import yoga from '../assets/yoga.jpg';
import pool from '../assets/pool.jpg';
import sauna from '../assets/sauna.jpg';
import locker from '../assets/locker.jpg';

const facilities = [
    {
        title: 'Cardio Area',
        image: cardio,
        description: 'Equipped with the latest treadmills, bikes, and ellipticals for all your cardio needs.',
    },
    {
        title: 'Weightlifting Zone',
        image: weights,
        description: 'Dumbbells, barbells, and machines to help you grow stronger every day.',
    },
    {
        title: 'Group Classes Studio',
        image: yoga,
        description: 'Join a variety of classes from HIIT to yoga with expert instructors.',
    },
    {
        title: 'Swimming Pool',
        image: pool,
        description: 'Olympic-sized indoor pool available all year round for lap swimming or leisure.',
    },
    {
        title: 'Sauna & Spa',
        image: sauna,
        description: 'Relax and recover in our state-of-the-art sauna and spa facilities.',
    },
    {
        title: 'Locker Rooms',
        image: locker,
        description: 'Clean and spacious locker rooms with showers, hairdryers, and secure storage.',
    },
];

const Facilities = () => {
    return (
        <div className="facilities-container">
            <h1 className="title">Our Gym Facilities</h1>
            <div className="grid">
                {facilities.map((facility, index) => (
                    <div className="facility-card" key={index}>
                        <img src={facility.image} alt={facility.title} className="facility-image" />
                        <h2>{facility.title}</h2>
                        <p>{facility.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Facilities;