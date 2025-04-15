import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";

const Login = ({ onLoginSuccess }) => {
    const navigate = useNavigate();

    const [isTabActive, setIsTabActive] = useState(true);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isInstructor, setIsInstructor] = useState(false); // nou
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [instructorCode, setInstructorCode] = useState(""); // nou

    useEffect(() => {
        const handleVisibilityChange = () => setIsTabActive(!document.hidden);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    const resetForm = () => {
        setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
        setSurname(""); setPhone(""); setInstructorCode(""); setIsSignUp(false); setIsInstructor(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const validPassword = /^[a-zA-Z0-9!@#$%^&*]+$/;

        if (!validPassword.test(password)) {
            alert("Password can only contain letters, numbers, and !@#$%^&* characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const validName = /^[a-zA-Z]+$/;

        if (!validName.test(name)) {
            alert("Name can only contain letters!");
            return;
        }

        const validSurname = /^[a-zA-Z]+$/;

        if (!validSurname.test(surname)) {
            alert("Surname can only contain letters!");
            return;
        }

        const validPhone = /^[0-9]+$/;

        if (!validPhone.test(phone) || phone.length !== 10) {
            alert("Phone is not in the right format");
            return;
        }

        const validEmail = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,}$/;

        if (!validEmail.test(email)) {
            alert("Please enter a valid email address.It must contain only letters, numbers, and valid characters(.-_), include an '@' symbol and a valid domain.");
            return;
        }

        if (email.includes('..')) {
            alert("Please enter a valid email address.It must contain only letters, numbers, and valid characters(.-_), include an '@' symbol and a valid domain. It can't contain double dot(..)");
            return;
        }
        
        try {
            const endpoint = isInstructor ? 'register-instructor' : 'register';
            const payload = {
                name, surname, email, password, phone
            };

            if (isInstructor) {
                payload.instructorCode = instructorCode;
            }

            await axios.post(`http://localhost:5017/api/auth/${endpoint}`, payload);
            alert('Registration successful! Please log in.');
            resetForm();
        } catch (error) {
            alert('Registration failed: ' + (error.response?.data?.message || "Unknown error"));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isInstructor ? 'login-instructor' : 'login';
            const payload = {
                email,
                password,
            };

            if (isInstructor) {
                payload.instructorCode = instructorCode;
            }

            const response = await axios.post(`http://localhost:5017/api/auth/${endpoint}`, payload);
            const data = response.data;

            alert("Login successful!");
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.id); 

            const userData = {
                name: data.name,
                email: data.email,
                role: data.role || (isInstructor ? "Instructor" : "User"),
                photo: data.photo || null
            };

            onLoginSuccess(userData);
            navigate("/UserProfile");
            resetForm();
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.message || "Unknown error"));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        isSignUp ? handleRegister(event) : handleLogin(event);
    };

    return (
        <div className={`login-container ${isTabActive ? "" : "inactive"}`}>
            <h2>
                {isSignUp
                    ? (isInstructor ? "Instructor Sign Up" : "User Sign Up")
                    : (isInstructor ? "Instructor Login" : "User Login")}
            </h2>
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
                <button type="submit"><h2>
                    {isSignUp
                        ? (isInstructor ? "Instructor Sign Up" : "User Sign Up")
                        : (isInstructor ? "Instructor Login" : "User Login")}
               </h2> </button>
            </form>

            <p onClick={() => setIsSignUp(!isSignUp)} className="toggle-text">
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign up"}
            </p>
            <p onClick={() => setIsInstructor(!isInstructor)} className="toggle-text">
                {isInstructor ? "Switch to User Mode" : "Login/Register as Instructor"}
            </p>
        </div>
    );
};

export default Login;
