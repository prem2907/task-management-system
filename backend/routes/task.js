import express from 'express';
import Task from '../models/Task.js';
import { authenticateToken } from '../middleware/auth.js'; // Ensure correct import for auth middleware

const router = express.Router();

// Create a new task
router.post('/', authenticateToken, async (req, res) => {
    const { title, description, dueDate } = req.body;

    try {
        const task = new Task({
            title,
            description,
            dueDate,
            owner: req.user.id // Assuming req.user is set by auth middleware
        });

        await task.save();
        
        res.status(201).json(task); // Return the created task

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all tasks for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.id });
        res.json(tasks); // Returns an empty array if no tasks found
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update task status
router.patch('/:id', authenticateToken, async (req, res) => {
    const { status } = req.body;

    try {
        let task = await Task.findById(req.params.id);
        
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Update the status of the task
        task.status = status;
        
        await task.save();
        
        res.json(task); // Return updated task

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Admin route to get all tasks from all users
router.get('/admin', authenticateToken, async (req, res) => {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied." });
    }

    try {
        const tasks = await Task.find(); // Fetch all tasks from all users
        res.json(tasks); // Return all tasks
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;