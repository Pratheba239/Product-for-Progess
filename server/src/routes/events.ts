import { Router } from 'express';
import db from '../services/dbService.js';

const router = Router();

// Get all events for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const events = await db('events')
            .where({ user_id: userId })
            .orderBy('start_time', 'asc');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Create an event
router.post('/', async (req, res) => {
    try {
        const { title, description, start_time, end_time, type, user_id, color_code } = req.body;
        const [newEvent] = await db('events').insert({
            title,
            description,
            start_time,
            end_time,
            type: type || 'event',
            user_id,
            color_code
        }).returning('*');
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
});

export default router;
