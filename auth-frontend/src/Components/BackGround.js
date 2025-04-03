import React from "react";
import "../styles/Background.css";
import gym1 from "../assets/gym1.jpg";
import gym2 from "../assets/gym2.jpg";

const Background = () => {
    return (
        <div className="background-container">
            <div className="overlay">
                <h1>Gym Access App</h1>
                <p>Welcome to our gym management system! We provide the best gym experience with:</p>
                <ul>
                    <li>Easy membership access</li>
                    <li>Personalized training plans</li>
                    <li>24/7 gym availability</li>
                    <li>Online bookings & payments</li>
                </ul>

                <div className="image-gallery">
                    <img src={gym1} alt="Gym Workout" />
                    <img src={gym2} alt="Gym Equipment" />
                </div>
            </div>
        </div>
    );
};

export default Background;
