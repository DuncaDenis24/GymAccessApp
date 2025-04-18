import React, { useEffect, useState } from 'react';
import "../styles/InstructorsClients.css";
import NoClients from './NoClients';    

const InstructorClients = ({ instructorId }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const instructorId = localStorage.getItem("userId");
        const fetchClients = async () => {
            try {
                const response = await fetch(`http://localhost:5017/api/instructors/get/${instructorId}/clients`);
                    const data = await response.json();
                    setClients(data);
            } catch (error) {
                console.error("Error fetching clients:", error);
                setClients([]);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [instructorId]);

    if (loading) return <p className="loading">Loading clients...</p>;

    return (
        <div className="clients-container">
            <h2 className="clients-title">Your Clients</h2>

            {clients.length === 0 ? (
                <NoClients/>
            ) : (
                <div className="clients-grid">
                    {clients.map((client) => (
                        <div key={client.user_Id} className="client-card">
                            <img
                                src={client.photo || "/default-avatar.png"}
                                alt={client.name}
                                onError={(e) => { e.target.src = "/default-avatar.png"; }}
                            />
                            <div>
                                <h4>{client.name} {client.surname}</h4>
                                <p>Email: {client.email}</p>
                                <p>Phone: {client.phone}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorClients;
