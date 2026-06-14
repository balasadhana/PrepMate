const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// GET /api/quizzes - Fetch all active quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ status: 'Active' })
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: quizzes,
      count: quizzes.length
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes',
      error: error.message
    });
  }
});

// GET /api/quizzes/:domain - Fetch quizzes for a specific domain
router.get('/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    
    // Validate domain
    const validDomains = ['DBMS', 'DSA', 'Frontend', 'Backend', 'System Design', 'Other'];
    if (!validDomains.includes(domain)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid domain. Must be one of: ' + validDomains.join(', ')
      });
    }
    
    const quizzes = await Quiz.find({ domain, status: 'Active' })
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: quizzes,
      count: quizzes.length,
      domain: domain
    });
  } catch (error) {
    console.error('Error fetching quizzes by domain:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes for domain',
      error: error.message
    });
  }
});

module.exports = router;
