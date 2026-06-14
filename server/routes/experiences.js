const express = require('express');
const SharedExperience = require('../models/SharedExperience');

const router = express.Router();

// POST /api/experiences - create a new user-shared experience
router.post('/', async (req, res) => {
  try {
    const { name, role, company, experience, date, tags } = req.body;
    console.log('[POST] /api/experiences body:', req.body);
    if (!name || !role || !company || !experience) {
      return res.status(400).json({ error: 'name, role, company, and experience are required' });
    }

    const doc = new SharedExperience({ name, role, company, experience, date });
    await doc.save();
    console.log('[POST] /api/experiences saved:', doc._id);
    return res.status(201).json({ message: 'Experience saved successfully', experience: doc });
  } catch (error) {
    console.error('Error saving experience:', error);
    return res.status(500).json({ error: 'Failed to save experience', details: error.message });
  }
});

// GET /api/experiences - list all experiences
router.get('/', async (_req, res) => {
  try {
    const list = await SharedExperience.find().sort({ date: -1 });
    console.log('[GET] /api/experiences count:', list.length);
    return res.status(200).json(list);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return res.status(500).json({ error: 'Failed to fetch experiences', details: error.message });
  }
});

module.exports = router;


