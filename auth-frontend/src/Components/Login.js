import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Add this
import "../styles/Login.css";

const Login = ({ onLoginSuccess }) => { // <-- Accept this prop
    const navigate = useNavigate(); // <-- Hook for navigation

    const [isTabActive, setIsTabActive] = useState(true);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [surname, setSurname] = useState("");
    const [phone, setPhone] = useState("");
    const [adminCode, setAdminCode] = useState("");

    useEffect(() => {
        const handleVisibilityChange = () => setIsTabActive(!document.hidden);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    const resetForm = () => {
        setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
        setSurname(""); setPhone(""); setAdminCode(""); setIsSignUp(false); setIsAdmin(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const endpoint = isAdmin ? 'register-admin' : 'register';
            await axios.post(`http://localhost:5017/api/auth/${endpoint}`, {
                name, surname, email, password, phone, adminCode, isAdmin
            });
            alert('Registration successful! Please log in.');
            resetForm();
        } catch (error) {
            alert('Registration failed: ' + (error.response?.data?.message || "Unknown error"));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5017/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(isAdmin ? { email, password, adminCode, isAdmin } : { email, password })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Login failed");

            // Handle success
            alert("Login successful! You are logged in.");
            localStorage.setItem("token", data.token);

            const userData = {
                name: data.name,
                email: data.email,
                membershipType: data.membershipType || "Basic", // fallback if undefined
                profilePicture: data.profilePicture,
                joinDate: data.joinDate || new Date().toISOString()
            };

            onLoginSuccess(userData);     // <-- Tell App.js the user is logged in
            navigate("/profile");         // <-- Redirect to profile
            resetForm();
        } catch (error) {
            if (error.message.includes("Emailul nu a fost găsit")) {
                alert("The email was not found.");
            } else if (error.message.includes("Parola este incorectă")) {
                alert("Incorrect password. Please try again.");
            } else if (error.message.includes("Acest utilizator nu este administrator")) {
                alert("This user is not an administrator.");
            } else if (error.message.includes("Codul de administrator este incorect")) {
                alert("Incorrect admin code.");
            } else {
                alert("Login failed: " + (error.message || "Unknown error"));
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        isSignUp ? handleRegister(event) : handleLogin(event);
    };

    return (
        <div className={`login-container ${isTabActive ? "" : "inactive"}`}>
            <h2>{isSignUp ? (isAdmin ? "Admin Sign Up" : "User Sign Up") : (isAdmin ? "Admin Login" : "User Login")}</h2>
            <form onSubmit={handleSubmit}>
                {isSignUp && (
                    <>
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        <label>Surname:</label>
                        <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required />
                        <label>Phone:</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </>
                )}
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {isSignUp && (
                    <>
                        <label>Confirm Password:</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </>
                )}
                {isAdmin && (
                    <>
                        <label>Admin Code:</label>
                        <input type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required />
                    </>
                )}
                <button type="submit"><h2>
                    {isSignUp
                        ? (isAdmin ? "Admin Sign Up" : "User Sign Up")
                        : (isAdmin ? "Admin Login" : "User Login")}
                </h2></button>
            </form>
            <p onClick={() => setIsSignUp(!isSignUp)} className="toggle-text">
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign up"}
            </p>
            {!isSignUp && (
                <p onClick={() => setIsAdmin(!isAdmin)} className="toggle-text">
                    {isAdmin ? "Switch to User Login" : "Login as Administrator"}
                </p>
            )}
        </div>
    );
};

export default Login;
