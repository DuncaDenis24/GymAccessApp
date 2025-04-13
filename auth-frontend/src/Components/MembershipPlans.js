import React from "react";
import "../styles/MembershipPlans.css";

const plans = [
    {
        name: "Starter",
        price: "$19/mo",
        hoursWithInstructor: "2 hours/week",
        freeStuff: "Free water bottle",
        access: "Access from 9 AM to 5 PM (Weekdays)",
        bgColor: "#e0f7fa"
    },
    {
        name: "Basic",
        price: "$29/mo",
        hoursWithInstructor: "4 hours/week",
        freeStuff: "Water bottle + Gym Towel",
        access: "Access from 6 AM to 10 PM (Weekdays + Sat)",
        bgColor: "#c8e6c9"
    },
    {
        name: "Premium",
        price: "$49/mo",
        hoursWithInstructor: "6 hours/week",
        freeStuff: "T-shirt + Supplements Samples",
        access: "Full-time Access + Sauna",
        bgColor: "#fff9c4"
    },
    {
        name: "Pro",
        price: "$69/mo",
        hoursWithInstructor: "Unlimited sessions",
        freeStuff: "Complete Gym Kit",
        access: "24/7 Access + Sauna + Pool",
        bgColor: "#ffe0b2"
    },
    {
        name: "Elite",
        price: "$99/mo",
        hoursWithInstructor: "Personal Trainer Included",
        freeStuff: "Custom Nutrition Plan + All Gear",
        access: "VIP Lounge + 24/7 Access + Spa",
        bgColor: "#f8bbd0"
    }
];

const MembershipPlans = () => {
    return (
        <div className="plans-container">
            <h1 className="plans-title">Choose Your Membership</h1>
            <div className="plans-grid">
                {plans.map((plan, index) => (
                    <div className="plan-card" style={{ backgroundColor: plan.bgColor }} key={index}>
                        <h2>{plan.name}</h2>
                        <p><strong>Price:</strong> {plan.price}</p>
                        <p><strong>Instructor Time:</strong> {plan.hoursWithInstructor}</p>
                        <p><strong>Free Stuff:</strong> {plan.freeStuff}</p>
                        <p><strong>Access:</strong> {plan.access}</p>
                        <button className="join-btn">Join Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MembershipPlans;