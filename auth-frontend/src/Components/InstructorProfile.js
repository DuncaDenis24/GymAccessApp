import "../styles/InstructorProfile.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const InstructorProfile = () => {
    const [instructor, setInstructor] = useState(null);
    const [clients, setClients] = useState([]);

    // This should be replaced with real auth logic
    const instructorId = 1; // Example instructor ID (could come from login/session)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const instructorId = localStorage.getItem("userId"); // or instructorId if stored separately
                const res = await axios.get(`http://localhost:5017/api/instructors/get/${instructorId}`);
                const data = res.data;

        // Fetch instructor's clients
        axios
            .get(`http://localhost:5000/api/instructors/${instructorId}/clients`)
            .then((res) => setClients(res.data))
            .catch((err) => console.error("Error fetching clients:", err));
    }, []);

    const handleLogout = () => {
        // Add logout logic here
        console.log("Logout clicked");
    };

    const handleEditProfile = () => {
        // Add navigation to edit profile page
        console.log("Edit profile clicked");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Instructor Profile</h1>

            {instructor ? (
                <div className="bg-white p-4 rounded shadow-md mb-6">
                    <p><strong>Name:</strong> {instructor.name} {instructor.surname}</p>
                    <p><strong>Email:</strong> {instructor.email}</p>
                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={handleEditProfile}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading instructor data...</p>
            )}

            <h2 className="text-2xl font-semibold mb-2">Clients</h2>
            {clients.length > 0 ? (
                <ul className="space-y-3">
                    {clients.map((client) => (
                        <li key={client.user_Id} className="p-4 border rounded shadow">
                            <p><strong>Name:</strong> {client.name} {client.surname}</p>
                            <p><strong>Email:</strong> {client.email}</p>
                            <p><strong>Membership:</strong> {client.membership?.membership_Type ?? "No membership"}</p>
                            <p><strong>Valid:</strong> {client.membership?.startDate ?? "N/A"} to {client.membership?.endDate ?? "N/A"}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No clients found.</p>
            )}
        </div>
    );
};

export default InstructorProfile;
