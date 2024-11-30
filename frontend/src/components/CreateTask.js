import React, { useState } from 'react';
import axios from 'axios';

const CreateTask = ({ onTaskCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/tasks', formData, {
                headers: { 'x-auth-token': localStorage.getItem('token') } // Send token here
            });
            console.log(res.data); // Handle success
            onTaskCreated(); // Notify parent component to refresh tasks
            setFormData({ title: '', description: '', dueDate: '' }); // Reset form
        } catch (err) {
            console.error(err.response ? err.response.data : err.message); // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-3">
            <h3>New Task</h3>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Task Title"
                    required
                    className="form-control"
                    id="title"
                />
                <label htmlFor="title">Title</label>
            </div>
            <div className="form-floating mb-3">
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Task Description"
                    required
                    className="form-control"
                    id="description"
                />
                <label htmlFor="description">Description</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="form-control"
                    id="duedate"
                />
                <label htmlFor="duedate">Due-date</label>
            </div>
            <button type="submit" className="btn btn-success">Add</button>
        </form>
    );
};

export default CreateTask;