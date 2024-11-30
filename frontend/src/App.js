import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TaskList from './components/TaskList'; // Import TaskList component
import Auth from './components/Auth'; // Import Auth component for login/signup

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Auth />} /> {/* Use Auth component for root path */}
                <Route path="/tasks" element={<TaskList />} />
            </Routes>
        </div>
    );
};

export default App;