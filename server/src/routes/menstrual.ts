import { Router } from 'express';
import db from '../services/dbService.js';

const router = Router();

// Get menstrual logs for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const logs = await db('menstrual_logs')
            .where({ user_id: userId })
            .orderBy('log_date', 'desc');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menstrual logs' });
    }
});

// Log menstrual cycle data
router.post('/', async (req, res) => {
    try {
        const { symptoms, intensity, log_date, user_id } = req.body;
        const [newLog] = await db('menstrual_logs').insert({
            symptoms,
            intensity,
            log_date: log_date || new Date(),
            user_id
        }).onConflict(['user_id', 'log_date']).merge().returning('*');
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to log menstrual data' });
    }
});

export default router;
