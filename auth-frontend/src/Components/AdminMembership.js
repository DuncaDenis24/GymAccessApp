import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminMembershipPlans.css"; // New CSS for styling
import Notification from "./Notification"; 

const AdminMembershipPlans = () => {
    const [membershipPlans, setMembershipPlans] = useState([]);
    const [newPlan, setNewPlan] = useState({
        name: "",
        description: "",
        price: "",
        access: "",
        hasInstructor: false
    });
    const [editingPlan, setEditingPlan] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchMembershipPlans();
    }, []);

    // Fetch all membership plans
    const fetchMembershipPlans = async () => {
        try {
            const res = await axios.get("https://localhost:7253/api/membershipplans/get");
            setMembershipPlans(res.data);
        } catch (err) {
            console.error("Failed to fetch membership plans", err);
        }
    };

    // Handle delete
    const handleDelete = async (planId) => {
        try {
            await axios.delete(`https://localhost:7253/api/membershipplans/delete/${planId}`);
            setNotification({ type: "success", message: "Membership plan deleted successfully" });
            fetchMembershipPlans(); 
        } catch (err) {
            setNotification({ type: "error", message: "Failed to delete membership plan" });
        }
    };

    // Handle edit
    const handleEditClick = (plan) => {
        setEditingPlan({ ...plan });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingPlan((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`https://localhost:7253/api/membershipplans/update/${editingPlan.membershipId}`, editingPlan);
            setEditingPlan(null);
            setNotification({ type: "success", message: "Membership plan updated successfully" });
            fetchMembershipPlans(); // Refresh the list
        } catch (err) {
            setNotification({ type: "error", message: "Failed to update membership plan" });
        }
    };

    // Handle create new plan
    const handleNewChange = (e) => {
        const { name, value } = e.target;
        setNewPlan((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = async () => {
        try {
            await axios.post("https://localhost:7253/api/membershipplans/create", newPlan);
            setNotification({ type: "success", message: "Membership plan created successfully" });
            fetchMembershipPlans();
            setNewPlan({
                name: "",
                description: "",
                price: "",
                access: "",
                hasInstructor: false
            });
        } catch (err) {
            setNotification({ type: "error", message: "Failed to create membership plan" });  
        }
    };

    return (

        <div className="admin-membership-plans">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <h2>Admin Membership Plans Management</h2>

            <div className="membership-plans-table-container">
                <table className="membership-plans-table">
                    <thead>
                        <tr>
                            <th>Plan Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Access</th>
                            <th>Instructor Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {membershipPlans.map((plan) => (
                            <tr key={plan.membershipId}>
                                <td>{plan.name}</td>
                                <td>{plan.description}</td>
                                <td>${plan.price}</td>
                                <td>{plan.access}</td>
                                <td>{plan.hasInstructor ? "Yes" : "No"}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => handleEditClick(plan)}>Edit</button>
                                    <button className="btn-delete" onClick={() => handleDelete(plan.membershipId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Membership Plan Form */}
            {editingPlan && (
                <div className="edit-form">
                    <h3>Edit Membership Plan #{editingPlan.membershipId}</h3>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={editingPlan.name}
                            onChange={handleEditChange}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={editingPlan.description}
                            onChange={handleEditChange}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={editingPlan.price}
                            onChange={handleEditChange}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label>Access:</label>
                        <input
                            type="text"
                            name="access"
                            value={editingPlan.access}
                            onChange={handleEditChange}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label>Has Instructor:</label>
                        <input
                            type="checkbox"
                            name="hasInstructor"
                            checked={editingPlan.hasInstructor}
                            onChange={() => setEditingPlan((prev) => ({ ...prev, hasInstructor: !prev.hasInstructor }))}
                        />
                    </div>
                    <button className="btn-save" onClick={handleUpdate}>Save Changes</button>
                    <button className="btn-cancel" onClick={() => setEditingPlan(null)}>Cancel</button>
                </div>
            )}

            {/* Add New Membership Plan Form */}
            <div className="create-form">
                <h3>Create New Membership Plan</h3>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={newPlan.name}
                        onChange={handleNewChange}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={newPlan.description}
                        onChange={handleNewChange}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={newPlan.price}
                        onChange={handleNewChange}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label>Access:</label>
                    <input
                        type="text"
                        name="access"
                        value={newPlan.access}
                        onChange={handleNewChange}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label>Has Instructor:</label>
                    <input
                        type="checkbox"
                        name="hasInstructor"
                        checked={newPlan.hasInstructor}
                        onChange={() => setNewPlan((prev) => ({ ...prev, hasInstructor: !prev.hasInstructor }))}
                    />
                </div>
                <button className="btn-add" onClick={handleCreate}>Add Plan</button>
            </div>
        </div>
    );
};

export default AdminMembershipPlans;
