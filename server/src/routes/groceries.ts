import { Router } from 'express';
import db from '../services/dbService.js';

const router = Router();

// Get all groceries for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const items = await db('groceries')
            .where({ user_id: userId })
            .orderBy('created_at', 'desc');
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch groceries' });
    }
});

// Add a grocery item
router.post('/', async (req, res) => {
    try {
        const { item_name, user_id } = req.body;
        const [newItem] = await db('groceries').insert({
            item_name,
            user_id
        }).returning('*');
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add grocery item' });
    }
});

// Toggle checked status
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_checked } = req.body;
        await db('groceries').where({ id }).update({ is_checked });
        res.json({ message: 'Item updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update grocery item' });
    }
});

// Delete a grocery item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db('groceries').where({ id }).del();
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete grocery item' });
    }
});

export default router;
