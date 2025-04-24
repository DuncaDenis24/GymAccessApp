import React, { useState, useEffect} from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "../styles/MembershipPlans.css";
import Notification from './Notification';

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
    },
    {
        name: "Solo Splash",
        price: 30,
        hoursWithInstructor: "No instructor",
        freeStuff: "Swim Cap + Water Bottle",
        access: "Access to Pool + Gym (6 AM - 10 PM)",
        bgColor: "#b3e5fc",
        noInstructor: true
    },
    {
        name: "Solo Zen",
        price: 50,
        hoursWithInstructor: "No instructor",
        freeStuff: "Yoga Mat + Relaxation Kit",
        access: "Full Gym + Yoga Studio (Weekdays + Sat)",
        bgColor: "#ffe0f0",
        noInstructor: true
    },
    {
        name: "Solo Bliss",
        price: 70,
        hoursWithInstructor: "No instructor",
        freeStuff: "Spa Pass + Premium Locker",
        access: "Gym + Sauna + Yoga Studio + Pool (Full-Time Access)",
        bgColor: "#dcedc8",
        noInstructor: true
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
    const navigate = useNavigate();

    // Fetch instructors on component mount
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch(`https://localhost:7253/api/instructors/get/instructors`);
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
            const response = await axios.get(`https://localhost:7253/api/memberships/user/${userId}`);
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

        if (plan.noInstructor) {
            setSelectedInstructor(null);
        }
    };

    const handleInstructorChange = (e) => {
        setSelectedInstructor(e.target.value);
    };

    const handleDurationChange = (e) => {
        setSelectedDuration(Number(e.target.value));
    };

    const handleConfirmMembership = async () => {
        if (!selectedInstructor) {
            // Show notification if no instructor is selected
            setNotification({ type: 'error', message: "Please select an instructor!" });
            return; // Stop further execution
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
            const response = await axios.post("https://localhost:7253/api/memberships/create", membershipData);
            setNotification({ type: 'success', message: "Membership created successfully!" });
            setShowModal(false);

            // Așteptăm notificarea să fie afișată complet (ex. 3.5 secunde), apoi navigăm
            setTimeout(() => {
                navigate('/profile');
            }, 3500);
        } catch (error) {
            console.error("Error creating membership:", error);
            setNotification({ type: 'error', message: "Failed to create membership." });
        }
    }



    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleCancelMembership = () => {
        setShowModal(false);
    };



    return (
        <div className="plans-container">
            <h1 className="plans-title">Choose Your Membership</h1>
            <div className="plans-grid">
                {plans.map((plan, index) => (
                    <div className="plan-card" style={{ backgroundColor: plan.bgColor }} key={index}>
                        {plan.noInstructor && (
                            <span className="no-instructor-badge">No Instructor Needed</span>
                        )}
                        <h2>{plan.name}</h2>
                        <p><strong>Price:</strong> ${plan.price}/mo</p>
                        <p><strong>Instructor Time:</strong> {plan.hoursWithInstructor}</p>
                        <p><strong>Free Stuff:</strong> {plan.freeStuff}</p>
                        <p><strong>Access:</strong> {plan.access}</p>
                        <button className="join-btn" onClick={() => handleJoinNow(plan)}>Join Now</button>
                    </div>
                ))}
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {showModal && (
                <div className="membership-modal">
                    <div className="membership-modal-content">
                        {existingMembership ? (
                            <>
                                <h3>You already have an active membership!</h3>
                                <p>To view your membership details, please visit your profile page.</p>
                                <div className="membership-modal-actions">
                                    <Link to="/profile">
                                        <button className="profile-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                            Go to Profile
                                        </button>
                                    </Link>
                                    <button className="cancel-btn" onClick={handleCancelMembership}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                        Close
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>Confirm Your Membership: <strong>{selectedPlan.name}</strong></h3>

                                {!selectedPlan?.noInstructor && (
                                    <>
                                        <h4>Select an Instructor</h4>
                                        <select onChange={handleInstructorChange}>
                                            <option value="">Choose an Instructor</option>
                                            {instructors.map((instructor) => (
                                                <option key={instructor.instructor_Id} value={instructor.instructor_Id}>
                                                    {instructor.name} {instructor.surname}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}

                                <h4>Choose Membership Duration</h4>
                                <select onChange={handleDurationChange}>
                                    <option value={1}>1 Month</option>
                                    <option value={3}>3 Months</option>
                                    <option value={6}>6 Months</option>
                                    <option value={12}>12 Months</option>
                                </select>

                                <p><strong>Total Price: ${totalPrice}</strong></p>

                                <div className="membership-modal-actions">
                                    <button onClick={handleConfirmMembership}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                        Confirm
                                    </button>
                                    <button onClick={handleCancelMembership}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

}

export default MembershipPlans;
