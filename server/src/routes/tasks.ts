import { Router } from 'express';
import db from '../services/dbService.js';

const router = Router();

// Get all tasks for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId; // In production, get from auth token
        const tasks = await db('tasks').where({ user_id: userId }).orderBy('created_at', 'desc');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Create a task
router.post('/', async (req, res) => {
    try {
        const { title, description, deadline, priority, user_id } = req.body;
        const [newTask] = await db('tasks').insert({
            title,
            description,
            deadline,
            priority,
            user_id
        }).returning('*');
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update task priority (for DND Matrix)
router.patch('/:id/priority', async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;
        await db('tasks').where({ id }).update({ priority });
        res.json({ message: 'Priority updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update priority' });
    }
});

export default router;
