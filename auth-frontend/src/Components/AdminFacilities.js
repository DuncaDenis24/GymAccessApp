import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminFacilities.css';
import Notification from './Notification';

const AdminFacilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', imageUrl: '' });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        fetchFacilities();
    }, []);

    const fetchFacilities = () => {
        axios.get('https://localhost:7253/api/facilities/get')
            .then(response => setFacilities(response.data))
            .catch(error => console.error('Error fetching facilities:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!form.title || !form.description || !form.imageUrl) {
            setNotification({ type: 'error', message: 'All fields are required' });
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmitCreate = () => {
        if (!validateForm()) return; // Prevent submission if form is invalid
        axios.post('https://localhost:7253/api/facilities/add', form)
            .then(() => {
                fetchFacilities();
                setNotification({ type: 'success', message: 'Facility added successfully' });
                resetForm();
            })
            .catch(err => console.error('Error adding facility:', err));
    };

    const handleSubmitEdit = () => {
        if (!validateForm()) return; // Prevent submission if form is invalid
        axios.put(`https://localhost:7253/api/facilities/update/${editingId}`, form)
            .then(() => {
                fetchFacilities();
                setNotification({ type: 'success', message: 'Facility updated successfully' });
                resetForm();
            })
            .catch(err => console.error('Error updating facility:', err));
    };

    const handleEdit = (facility) => {
        setForm({
            title: facility.title,
            description: facility.description,
            imageUrl: facility.imageUrl,
        });
        setEditingId(facility.facilityId);
    };

    const handleDelete = (id) => {
        axios.delete(`https://localhost:7253/api/facilities/delete/${id}`)
            .then(() => fetchFacilities())
            .then(() => setNotification({ type: 'success', message: 'Facility deleted successfully' }))
            .catch(err => console.error('Error deleting facility:', err));
    };

    const resetForm = () => {
        setForm({ title: '', description: '', imageUrl: '' });
        setEditingId(null);
    };

    return (
        <div className="admin-facilities">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <h2>Manage Gym Facilities</h2>

            {/* Create New Facility Form */}
            {!editingId && (
                <div className="create-form">
                    <h3>Add New Facility</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            name="title"
                            placeholder="Facility Title"
                            value={form.title}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="description"
                            placeholder="Facility Description"
                            value={form.description}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="imageUrl"
                            placeholder="Image URL"
                            value={form.imageUrl}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button onClick={handleSubmitCreate} className="btn-add">
                        Add Facility
                    </button>
                </div>
            )}

            {/* Edit Existing Facility Form */}
            {editingId && (
                <div className="edit-form">
                    <h3>Edit Facility</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            name="title"
                            placeholder="Facility Title"
                            value={form.title}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="description"
                            placeholder="Facility Description"
                            value={form.description}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="imageUrl"
                            placeholder="Image URL"
                            value={form.imageUrl}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button onClick={handleSubmitEdit} className="btn-save" disabled={!!error || !form.title || !form.description || !form.imageUrl}>
                        Save Changes
                    </button>
                    <button onClick={resetForm} className="btn-cancel">
                        Cancel
                    </button>
                </div>
            )}

            {/* Facility List */}
            <div className="grid">
                {facilities.map(facility => (
                    <div className="facility-card" key={facility.facilityId}>
                        <img
                            src={facility.imageUrl}
                            alt={facility.title}
                            className="facility-image"
                        />
                        <h2>{facility.title}</h2>
                        <p>{facility.description}</p>
                        <div className="admin-actions">
                            <button onClick={() => handleEdit(facility)} className="btn-edit">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(facility.facilityId)} className="btn-delete">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminFacilities;
