// Import required packages
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"; // Optional logging middleware
import userRoutes from "./routes/user.js";
import taskRoutes from "./routes/task.js";
import { authenticateToken } from "./middleware/auth.js"; // Correct import for authentication middleware

// Load environment variables from .env file
dotenv.config();

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env file");
    process.exit(1);
}

// Create an instance of Express
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // Adjust as necessary for production
}));
app.use(express.json()); // For parsing application/json
app.use(morgan('dev')); // Optional logging middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Define a simple route
app.get("/", (req, res) => {
    res.send("Welcome to the Task Management API");
});

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Admin route to get all users' task details
app.get("/api/admin/tasks", authenticateToken, async (req, res) => {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied." });
    }

    try {
        const users = await User.find(); // Assuming you have a User model
        const userTasks = await Promise.all(users.map(async (user) => {
            const ongoingCount = await Task.countDocuments({ userId: user._id, status: 'ongoing' });
            const completedCount = await Task.countDocuments({ userId: user._id, status: 'completed' });
            const cancelledCount = await Task.countDocuments({ userId: user._id, status: 'cancelled' });

            return {
                id: user._id,
                name: user.username,
                ongoingCount,
                completedCount,
                cancelledCount,
            };
        }));

        res.json(userTasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});