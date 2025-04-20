import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import "../styles/Login.css";

const Login = ({ onLoginSuccess }) => {
    const navigate = useNavigate('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [isInstructor, setIsInstructor] = useState(false);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [instructorCode, setInstructorCode] = useState("");
    const [notification, setNotification] = useState({ message: "", type: "" });
   
    const resetForm = () => {
        setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
        setSurname(""); setPhone(""); setInstructorCode(""); setIsSignUp(false); setIsInstructor(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const validPassword = /^[a-zA-Z0-9!@#$%^&*]+$/;
        if (!validPassword.test(password)) {
            setNotification({ type: "error", message: "Password can only contain letters, numbers, and !@#$%^&* characters." });
            return;
        }

        if (password !== confirmPassword) {
            setNotification({ type: "error", message: "Passwords do not match!" });
            return;
        }

        const validName = /^[a-zA-Z]+$/;
        if (!validName.test(name)) {
            setNotification({ type: "error", message: "Name can only contain letters!" });
            return;
        }

        const validSurname = /^[a-zA-Z]+$/;
        if (!validSurname.test(surname)) {
            setNotification({ type: "error", message: "Surname can only contain letters!" });
            return;
        }

        const validPhone = /^[0-9]+$/;
        if (!validPhone.test(phone) || phone.length !== 10) {
            setNotification({ type: "error", message: "Phone number must be 10 digits" });
            return;
        }

        const validEmail = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,}$/;
        if (!validEmail.test(email)) {
            setNotification({ type: "error", message: "Please enter a valid email address." });
            return;
        }

        if (email.includes('..')) {
            setNotification({ type: "error", message: "Email can't contain double dot(..)" });
            return;
        }

        try {
            const endpoint = isInstructor ? 'register-instructor' : 'register';
            const payload = { name, surname, email, password, phone };
            if (isInstructor) payload.instructorCode = instructorCode;

            await axios.post(`http://localhost:5017/api/auth/${endpoint}`, payload);
            setNotification({ type: "success", message: 'Registration successful! Please log in.' });
            resetForm();
        } catch (error) {
            setNotification({ type: "error", message: 'Registration failed: ' + (error.response?.data?.message || "Unknown error") });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const endpoint = isInstructor ? 'login-instructor' : 'login';
            const payload = { email, password };

            if (isInstructor) payload.instructorCode = instructorCode;

            const response = await axios.post(`http://localhost:5017/api/auth/${endpoint}`, payload);
            const data = response.data;

            const userData = {
                name: data.name,
                email: data.email,
                role: data.role || (isInstructor ? "instructor" : "user"),
                photo: data.photo || null
            };
           

            setNotification({type: "success", message: "Login successful!"});

            setTimeout(() => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.id);
                localStorage.setItem("role", data.role);
                onLoginSuccess(userData);
                if (userData.role === 'instructor') {
                    navigate('/instructor-profile');
                } else {
                    navigate('/profile');
                }

                resetForm();
            }, 2000); // Add a delay before redirect

        } catch (error) {
            setNotification({ type: "error", message: 'Login failed: ' + (error.response?.data?.message || "Unknown error") });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        isSignUp ? handleRegister(event) : handleLogin(event);
    };

    return (
        <div>
            {notification.message && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "" })}
                />
            )}

            <div className="login-box-container">
                <h2>{isSignUp ? (isInstructor ? "Instructor Sign Up" : "User Sign Up") : (isInstructor ? "Instructor Login" : "User Login")}</h2>
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
                    {isInstructor && (
                        <>
                            <label>Instructor Code:</label>
                            <input type="password" value={instructorCode} onChange={(e) => setInstructorCode(e.target.value)} required />
                        </>
                    )}
                    <button type="submit">
                        {isSignUp ? (isInstructor ? "Instructor Sign Up" : "User Sign Up") : (isInstructor ? "Instructor Login" : "User Login")}
                    </button>
                </form>

                <p onClick={() => setIsSignUp(!isSignUp)} className="login-box-toggle-text">
                    {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign up"}
                </p>
                <p onClick={() => setIsInstructor(!isInstructor)} className="login-box-toggle-text">
                    {isInstructor ? "Switch to User Mode" : "Login/Register as Instructor"}
                </p>
            </div>
        </div>
    );
};

export default Login;
