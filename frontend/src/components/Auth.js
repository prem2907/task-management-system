import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

    const toggleForm = () => {
        setIsLogin(!isLogin); // Toggle between true and false
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    {isLogin ? <Login toggleForm={toggleForm} /> : <Register toggleForm={toggleForm} />}
                </div>
            </div>
        </div>
    );
};

export default Auth;