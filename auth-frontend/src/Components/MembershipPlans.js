import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import "../styles/MembershipPlans.css";

const plans = [
    {
        name: "Starter",
        price: 19,
        hoursWithInstructor: "2 hours/week",
        freeStuff: "Free water bottle",
        access: "Access from 9 AM to 5 PM (Weekdays)",
        bgColor: "#e0f7fa"
    },
    {
        name: "Basic",
        price: 29,
        hoursWithInstructor: "4 hours/week",
        freeStuff: "Water bottle + Gym Towel",
        access: "Access from 6 AM to 10 PM (Weekdays + Sat)",
        bgColor: "#c8e6c9"
    },
    {
        name: "Premium",
        price: 49,
        hoursWithInstructor: "6 hours/week",
        freeStuff: "T-shirt + Supplements Samples",
        access: "Full-time Access + Sauna",
        bgColor: "#fff9c4"
    },
    {
        name: "Pro",
        price: 69,
        hoursWithInstructor: "Unlimited sessions",
        freeStuff: "Complete Gym Kit",
        access: "24/7 Access + Sauna + Pool",
        bgColor: "#ffe0b2"
    },
    {
        name: "Elite",
        price: 99,
        hoursWithInstructor: "Personal Trainer Included",
        freeStuff: "Custom Nutrition Plan + All Gear",
        access: "VIP Lounge + 24/7 Access + Spa",
        bgColor: "#f8bbd0"
    }
];

const MembershipPlans = () => {
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [existingMembership, setExistingMembership] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(1);
    const [totalPrice, setTotalPrice] = useState(null);
    const [notification, setNotification] = useState(null);

    // Fetch instructors on component mount
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch(`http://localhost:5017/api/instructors/get/instructors`);
                const data = await response.json();
                setInstructors(data);
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };
        fetchInstructors();
    }, []);

    // Calculate total price based on duration and plan price
    const calculateTotalPrice = () => {
        if (selectedPlan) {
            const price = selectedPlan.price;
            setTotalPrice(price * selectedDuration);
        }
    };

    useEffect(() => {
        calculateTotalPrice();
    }, [selectedDuration, selectedPlan]);

    const handleJoinNow = async (plan) => {
        const userId = localStorage.getItem("userId");

        try {
            const response = await axios.get(`http://localhost:5017/api/memberships/user/${userId}`);
            const { hasMembership } = response.data;

            if (hasMembership) {
                setExistingMembership(true);
                setShowModal(true);
                return;
            }

        } catch (err) {
            console.log("No existing membership found. Proceeding to select instructor.");
        }

        setSelectedPlan(plan);
        setExistingMembership(null);
        setShowModal(true);
    };

    const handleInstructorChange = (e) => {
        setSelectedInstructor(e.target.value);
    };

    const handleDurationChange = (e) => {
        setSelectedDuration(Number(e.target.value));
    };

    const handleConfirmMembership = async () => {
        if (!selectedInstructor) {
            setNotification({ type: 'error', message: "Please select an instructor!" });
            return;
        }

        const userId = localStorage.getItem("userId");

        const membershipData = {
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + selectedDuration)).toISOString(),
            price: totalPrice,
            membershipType: selectedPlan.name,
            userId: userId,
            instructorId: selectedInstructor
        };

        try {
            const response = await axios.post("http://localhost:5017/api/memberships/create", membershipData);
            setNotification({ type: 'success', message: "Membership created successfully!" });
            setShowModal(false);
        } catch (error) {
            console.error("Error creating membership:", error);
            setNotification({ type: 'error', message: "Failed to create membership." });
        }
    };

    const handleCancelMembership = () => {
        setShowModal(false);
    };

    const renderNotification = () => {
        if (!notification) return null;

        return (
            <div className={`notification ${notification.type}-notification fade-out`}>
                <span className="notification-icon">ℹ️</span>
                {notification.message}
            </div>
        );
    };

    return (
        <div className="plans-container">
            {renderNotification()}
            <h1 className="plans-title">Choose Your Membership</h1>
            <div className="plans-grid">
                {plans.map((plan, index) => (
                    <div className="plan-card" style={{ backgroundColor: plan.bgColor }} key={index}>
                        <h2>{plan.name}</h2>
                        <p><strong>Price:</strong> ${plan.price}/mo</p>
                        <p><strong>Instructor Time:</strong> {plan.hoursWithInstructor}</p>
                        <p><strong>Free Stuff:</strong> {plan.freeStuff}</p>
                        <p><strong>Access:</strong> {plan.access}</p>
                        <button className="join-btn" onClick={() => handleJoinNow(plan)}>Join Now</button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal show">
                    <div className="modal-content">
                        {existingMembership ? (
                            <>
                                <h3>You already have an active membership!</h3>
                                <p>To view your membership details, please visit your profile page.</p>
                                <div className="modal-actions">
                                    <Link to="/profile">
                                        <button>
                                            Go to Profile
                                        </button>
                                    </Link>
                                    <button onClick={handleCancelMembership}>Close</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>Select an Instructor for {selectedPlan.name}</h3>
                                <select onChange={handleInstructorChange}>
                                    <option value="">Choose an Instructor</option>
                                    {instructors.map((instructor) => (
                                        <option key={instructor.instructor_Id} value={instructor.instructor_Id}>
                                            {instructor.name} {instructor.surname}
                                        </option>
                                    ))}
                                </select>

                                <h4>Choose Membership Duration</h4>
                                <select onChange={handleDurationChange}>
                                    <option value={1}>1 Month</option>
                                    <option value={3}>3 Months</option>
                                    <option value={6}>6 Months</option>
                                    <option value={12}>12 Months</option>
                                </select>

                                <p><strong>Total Price: ${totalPrice}</strong></p>

                                <div className="modal-actions">
                                    <button onClick={handleConfirmMembership}>Confirm Membership</button>
                                    <button onClick={handleCancelMembership}>Cancel</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembershipPlans;
