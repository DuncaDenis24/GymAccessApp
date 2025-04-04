import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Login.css";

const Login = () => {
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
        const handleVisibilityChange = () => {
            setIsTabActive(!document.hidden);
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    // ** Handle User Registration **
    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5017/api/auth/register', {
                name, surname, email, password, phone, adminCode
            });
            alert('Registration successful: ' + response.data.message);
        
           
        } catch (error) {
            alert('Registration failed: ' + (error.response?.data?.message || "Unknown error"));
        }
    };

    // ** Handle User Login **
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isAdmin) {
            try {
                const response = await fetch("http://localhost:5017/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"  // Ensure backend responds with JSON
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json(); // Ensure JSON parsing
                if (!response.ok) throw new Error(data.message || "Login failed");

                alert("Login successful\n You are logged in!");
                localStorage.setItem("token", data.token);  // Store JWT token if provided
            } catch (error) {
                console.error("Login error:", error);
                alert("Login failed\n Password or email incorect");
            }
        }
        else {
            try {
                const response = await fetch("http://localhost:5017/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"  // Ensure backend responds with JSON
                    },
                    body: JSON.stringify({ email, password, adminCode })
                });

                const data = await response.json(); // Ensure JSON parsing
                if (!response.ok) throw new Error(data.message || "Login failed");

                alert("Login successful\n You are logged in!");
                localStorage.setItem("token", data.token);  // Store JWT token if provided
            } catch (error) {
                console.error("Login error:", error);
                alert("Login failed\n Password or email incorect");
            }
        }
    };





    // ** Submit form and call appropriate function **
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSignUp) {
            await handleRegister(event);  // Call register function
        } else {
            await handleLogin(event);  // Call login function
        }
    };

    return (
        <div className={`login-container ${isTabActive ? "" : "inactive"}`}>
            <h2>{isSignUp ? "Sign Up" : isAdmin ? "Admin Login" : "User Login"}</h2>
            <form onSubmit={handleSubmit}>
                {isSignUp && (
                    <>
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />

                        <label>Surname:</label>
                        <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Enter your surname" required />

                        <label>Phone:</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" required />
                    </>
                )}

                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />

                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />

                {isSignUp && (
                    <>
                        <label>Confirm Password:</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />
                    </>
                )}

                {isAdmin && (
                    <>
                        <label>Admin Code:</label>
                        <input type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} placeholder="Enter admin code" required />
                    </>
                )}

                <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
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






/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Login.css";

const Login = () => {
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
                name, surname, email, password, phone, adminCode
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
                body: JSON.stringify(isAdmin ? { email, password, adminCode } : { email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Login failed");

            alert("Login successful! You are logged in.");
            localStorage.setItem("token", data.token);
            resetForm();
        } catch (error) {
            alert("Login failed: Incorrect email or password");
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
                <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
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

*/




