const express = require('express');
const ResumePublic = require('../models/ResumePublic');

const router = express.Router();

// POST /api/resumes - create a new resume
router.post('/', async (req, res) => {
  try {
    console.log('[POST] /api/resumes body:', req.body);
    const data = req.body;
    if (!data?.personalDetails?.fullName || !data?.personalDetails?.email || !data?.personalDetails?.phone) {
      return res.status(400).json({ error: 'fullName, email and phone are required in personalDetails' });
    }
    const doc = new ResumePublic(data);
    await doc.save();
    console.log('[POST] /api/resumes saved:', doc._id);
    return res.status(201).json({ message: 'Resume saved successfully', resumeId: doc._id, resume: doc });
  } catch (error) {
    console.error('Error saving resume:', error);
    return res.status(500).json({ error: 'Failed to save resume', details: error.message });
  }
});

// GET /api/resumes - list all resumes
router.get('/', async (_req, res) => {
  try {
    const list = await ResumePublic.find().sort({ createdAt: -1 });
    console.log('[GET] /api/resumes count:', list.length);
    return res.status(200).json(list);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return res.status(500).json({ error: 'Failed to fetch resumes', details: error.message });
  }
});

// GET /api/resumes/:id - fetch one resume
router.get('/:id', async (req, res) => {
  try {
    const resume = await ResumePublic.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    return res.status(200).json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    return res.status(500).json({ error: 'Failed to fetch resume', details: error.message });
  }
});

// GET /api/resumes/user/:email - fetch resumes by user email
router.get('/user/:email', async (req, res) => {
  try {
    const resumes = await ResumePublic.find({ 'personalDetails.email': req.params.email }).sort({ createdAt: -1 });
    return res.status(200).json(resumes);
  } catch (error) {
    console.error('Error fetching user resumes:', error);
    return res.status(500).json({ error: 'Failed to fetch user resumes', details: error.message });
  }
});

module.exports = router;


