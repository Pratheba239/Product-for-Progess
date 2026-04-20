import { Router } from 'express';
import db from '../services/dbService.js';

const router = Router();

// Get mood logs for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const logs = await db('mood_logs')
            .where({ user_id: userId })
            .orderBy('log_date', 'desc');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch mood logs' });
    }
});

// Log mood
router.post('/', async (req, res) => {
    try {
        const { emotions, log_date, user_id } = req.body;
        const [newLog] = await db('mood_logs').insert({
            emotions,
            log_date: log_date || new Date(),
            user_id
        }).onConflict(['user_id', 'log_date']).merge().returning('*');
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to log mood' });
    }
});

export default router;
