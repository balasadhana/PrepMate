const express = require('express');
const Tip = require('../models/Tip');

const router = express.Router();

// POST /api/tips - create a new tip (Admin)
router.post('/', async (req, res) => {
  try {
    const { title, content, category, createdBy } = req.body;

    if (!title || !content || !createdBy) {
      return res.status(400).json({ error: 'title, content and createdBy are required' });
    }

    const tip = new Tip({ title, content, category, createdBy });
    await tip.save();

    return res.status(201).json(tip);
  } catch (error) {
    console.error('Error creating tip:', error);
    return res.status(500).json({ error: 'Failed to create tip' });
  }
});

// GET /api/tips - list all tips
router.get('/', async (_req, res) => {
  try {
    const tips = await Tip.find().sort({ createdAt: -1 });
    return res.status(200).json(tips);
  } catch (error) {
    console.error('Error fetching tips:', error);
    return res.status(500).json({ error: 'Failed to fetch tips' });
  }
});

module.exports = router;


