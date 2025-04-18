import React from "react";
import "../styles/Background.css";
import gym1 from "../assets/gym1.jpg";
import gym2 from "../assets/gym2.jpg";

const Background = () => {
    return (
        <div className="background-container">
            <div className="overlay">
                <h1>Gym Access App</h1>
                <p>Welcome to our gym management system!</p>
                <p>We provide the best gym experience with:</p>
                <ul>
                    <li>Easy membership access</li>
                    <li>Personalized training plans</li>
                    <li>24/7 gym availability</li>
                    <li>Online bookings & payments</li>
                </ul>
                <div className="dumbbell-animation">
                    <svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
                        <g className="bouncing">
                            
                            <rect x="40" y="35" width="20" height="4" fill="#fff" />
                            
                            <rect x="30" y="32" width="8" height="10" fill="#ccc" />
                            
                            <rect x="62" y="32" width="8" height="10" fill="#ccc" />
                        </g>
                    </svg>
                </div>

                <div className="image-gallery">
                    <img src={gym1} alt="Gym Workout" />
                    <img src={gym2} alt="Gym Equipment" />
                </div>
            </div>
        </div>
    );
};

export default Background;
