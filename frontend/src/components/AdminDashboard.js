import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [userTasks, setUserTasks] = useState([]);

    const fetchUserTasks = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/tasks", {
                headers: { "x-auth-token": localStorage.getItem("token") }
            });
            setUserTasks(res.data); // Assuming this returns an array of users with their task counts
        } catch (err) {
            console.error(err.response.data); // Handle error
        }
    };

    useEffect(() => {
        fetchUserTasks(); // Fetch user tasks when component mounts
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center">User Task Overview</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>User's Name</th>
                        <th>Ongoing Tasks</th>
                        <th>Completed Tasks</th>
                        <th>Cancelled Tasks</th>
                    </tr>
                </thead>
                <tbody>
                    {userTasks.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.ongoingCount}</td>
                            <td>{user.completedCount}</td>
                            <td>{user.cancelledCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;