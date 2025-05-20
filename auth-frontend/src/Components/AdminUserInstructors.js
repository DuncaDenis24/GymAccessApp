import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Notification from './Notification';
import "../styles/AdminUserInstructors.css";

const AdminUserInstructors = () => {
    const [users, setUsers] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [notification, setNotification] = useState(null);

    // Fetch users and instructors on component load
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('https://localhost:7253/api/user/getAll');
                setUsers(res.data);
            } catch (err) {
                console.error('Failed to fetch users:', err.response || err.message);
                setNotification({ type: 'error', message: 'Failed to load users' });
            }
        };


        const fetchInstructors = async () => {
            try {
                const res = await axios.get('https://localhost:7253/api/instructors/get/instructors');
                //console.log('Fetched Instructors:', res.data); // Debugging
                setInstructors(res.data);
            } catch (err) {
                console.error('Failed to fetch instructors:', err.response || err.message);
                setNotification({ type: 'error', message: 'Failed to load instructors' });
            }
        };


        fetchUsers();
        fetchInstructors();
    }, []);

    // Handle instructor update
    const handleUpdateInstructor = async () => {
        if (!selectedUser || !selectedInstructor) {
            setNotification({ type: 'error', message: 'Please select a user and an instructor' });
            return;
        }
        //console.log('Selected User ID:', selectedUser);
        //console.log('Request Body:', { instructorId: selectedInstructor });
        try {
            await axios.put(`https://localhost:7253/api/user/updateInstructor/${selectedUser}`, {
                instructorId: selectedInstructor, // Ensure this matches the backend DTO
            });
            setNotification({ type: 'success', message: 'Instructor updated successfully' });
        } catch (err) {
            console.error('Failed to update instructor', err.response || err.message);
            setNotification({ type: 'error', message: 'Failed to update instructor' });
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
            <h2>Manage User Instructors</h2>

            {/* User Selection */}
            <div className="form-group">
                <label htmlFor="userSelect">Select User:</label>
                <select
                    id="userSelect"
                    value={selectedUser || ''}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="" disabled>Select a user</option>
                    {users.map((user) => (
                        <option key={user.userId} value={user.userId}>
                            {user.name} {user.surname} (Instructor: {user.instructor?.name || 'None'})
                        </option>
                    ))}
                </select>
            </div>

            {/* Instructor Selection */}
            <div className="form-group">
                <label htmlFor="instructorSelect">Select Instructor:</label>
                <select
                    id="instructorSelect"
                    value={selectedInstructor || ''}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                >
                    <option value="" disabled>Select an instructor</option>
                    {instructors.map((instructor) => (
                        <option key={instructor.instructor_Id} value={instructor.instructor_Id}>
                            {instructor.name} {instructor.surname}
                        </option>
                    ))}
                </select>
            </div>

            {/* Update Button */}
            <button onClick={handleUpdateInstructor} className="btn-update">
                Update Instructor
            </button>
        </div>
    );
};

export default AdminUserInstructors;