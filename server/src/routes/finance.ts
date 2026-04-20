import { Router } from 'express';
import db from '../services/dbService.js';

const router = Router();

// Get all finance entries for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const entries = await db('finance_entries')
            .where({ user_id: userId })
            .orderBy('entry_date', 'desc');
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch finance entries' });
    }
});

// Create a finance entry
router.post('/', async (req, res) => {
    try {
        const { item_name, category, cost, payment_mode, type, user_id, entry_date } = req.body;
        const [newEntry] = await db('finance_entries').insert({
            item_name,
            category,
            cost,
            payment_mode,
            type,
            user_id,
            entry_date: entry_date || new Date()
        }).returning('*');
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create finance entry' });
    }
});

// Delete a finance entry
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db('finance_entries').where({ id }).del();
        res.json({ message: 'Entry deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete finance entry' });
    }
});

export default router;
