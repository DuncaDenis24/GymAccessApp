import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Notification from './Notification';
import "../styles/AdminManageInstructors.css";

const AdminManageInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const res = await axios.get('https://localhost:7253/api/instructors/get/instructors');
            setInstructors(res.data);
        } catch (err) {
            setNotification({ type: 'error', message: 'Failed to load instructors' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this instructor?")) return;
        try {
            await axios.delete(`https://localhost:7253/api/instructors/delete/${id}`);
            setNotification({ type: 'success', message: 'Instructor deleted successfully' });
            fetchInstructors();
        } catch (err) {
            setNotification({ type: 'error', message: 'Failed to delete instructor' });
        }
    };

    return (
        <div className="admin-user-instructors">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <h2>Manage Instructors</h2>
            <div className="grid">
                {instructors.length === 0 && <p>No instructors found.</p>}
                {instructors.map((instructor) => (
                    <div className="facility-card" key={instructor.instructor_Id}>
                        <h3>{instructor.name} {instructor.surname}</h3>
                        <p>Email: {instructor.email}</p>
                        <p>Phone: {instructor.phone}</p>
                        <button
                            className="btn-delete"
                            onClick={() => handleDelete(instructor.instructor_Id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminManageInstructors;
