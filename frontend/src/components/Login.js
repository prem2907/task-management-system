import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ toggleForm }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/users/login", credentials);
            localStorage.setItem("token", res.data.token); // Store the token
            navigate('/tasks'); // Redirect to tasks page after login
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="form-control"
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="form-control"
            />
            <button type="submit" className="btn btn-primary">Login</button>
            <p className="mt-2">
                New user? <button type="button" className="btn btn-link" onClick={toggleForm}>Sign Up</button>
            </p>
        </form>
    );
};

export default Login;