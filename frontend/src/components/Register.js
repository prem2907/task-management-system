import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ toggleForm }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users/register', formData);
            alert('Registration successful! Now you can log in.');
            toggleForm(); // Switch to login form after successful registration
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="form-control"
            />
            <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="form-control"
            />
            <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="form-control"
            />
            <button type="submit" className="btn btn-success">Sign Up</button>
            <p className="mt-2">
                Existing user? <button type="button" className="btn btn-link" onClick={toggleForm}>Log In</button>
            </p>
        </form>
    );
};

export default Register;