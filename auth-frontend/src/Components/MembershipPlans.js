import React, { useState, useEffect} from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "../styles/MembershipPlans.css";
import Notification from './Notification';

const MembershipPlans = () => {
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [existingMembership, setExistingMembership] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(1);
    const [totalPrice, setTotalPrice] = useState(null);
    const [notification, setNotification] = useState(null);
    const [membershipPlans, setMembershipPlans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMembershipPlans = async () => {
            try {
                const response = await fetch(`https://localhost:7253/api/membershipplans/get`);
                const data = await response.json();
                setMembershipPlans(data);
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };
        fetchMembershipPlans();
    }, []);
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
        console.log(selectedPlan)
        setExistingMembership(null);
        setShowModal(true);

        if (plan.hasInstructor) {
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
        const userId = parseInt(localStorage.getItem("userId"), 10); // Ensure userId is an integer

        // For instructor-based memberships, make sure one is selected
        if (selectedPlan?.hasInstructor && !selectedInstructor) {
            setNotification({ type: 'error', message: "Please select an instructor!" });
            return;
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + selectedDuration);

        // Build the payload conditionally
        const membershipData = {
            membershipId: selectedPlan.membershipId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            price: totalPrice,
            membershipType: selectedPlan.name,
            userId: userId,
            instructorId: !selectedPlan.hasInstructor ? null : parseInt(selectedInstructor, 10)
        };

        try {
            await axios.post("https://localhost:7253/api/memberships/create", membershipData);
            setNotification({ type: 'success', message: "Membership created successfully!" });
            setShowModal(false);

            setTimeout(() => {
                navigate('/profile');
            }, 3500);
        } catch (error) {
            console.error("Error creating membership:", error);
            console.log("Membership Data Sent:", membershipData);
            if (error.response) console.log("Backend Response:", error.response.data);
            setNotification({ type: 'error', message: "Failed to create membership." });
        }
    };





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
                {membershipPlans.map((plan, index) => (
                    <div className="plan-card" key={index}>
                        {!plan.hasInstructor && (
                            <span className="no-instructor-badge">No Instructor Needed</span>
                        )}
                        <h2>{plan.name}</h2>
                        <p><strong>Price:</strong> ${plan.price}/mo</p>
                        <p><strong>Description:</strong> {plan.description}</p>
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

                                {selectedPlan?.hasInstructor && (
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
