const express = require('express');
const router = express.Router();
const ResumeTemplate = require('../models/ResumeTemplate');
const Resume = require('../models/Resume');

// Get all available resume templates
router.get('/resume-templates', async (req, res) => {
  try {
    const templates = await ResumeTemplate.find().sort({ uploadedAt: -1 });
    res.status(200).json(templates);
  } catch (err) {
    console.error('Error fetching templates:', err);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get a specific template by ID
router.get('/resume-templates/:id', async (req, res) => {
  try {
    const template = await ResumeTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (err) {
    console.error('Error fetching template:', err);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Save user resume data
router.post('/resumes', async (req, res) => {
  try {
    const { userId, templateId, ...resumeData } = req.body;
    
    // Check if template exists
    const template = await ResumeTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Create new resume or update existing one
    let resume = await Resume.findOne({ userId, templateId });
    
    if (resume) {
      // Update existing resume
      resume = await Resume.findByIdAndUpdate(
        resume._id,
        { ...resumeData, updatedAt: Date.now() },
        { new: true }
      );
    } else {
      // Create new resume
      resume = new Resume({
        userId,
        templateId,
        ...resumeData
      });
      await resume.save();
    }

    res.status(201).json({ 
      message: 'Resume saved successfully',
      resumeId: resume._id,
      resume 
    });
  } catch (err) {
    console.error('Error saving resume:', err);
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

// Get user's saved resumes
router.get('/resumes/:userId', async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.params.userId })
      .populate('templateId', 'title url tags')
      .sort({ updatedAt: -1 });
    
    res.status(200).json(resumes);
  } catch (err) {
    console.error('Error fetching user resumes:', err);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Get a specific resume by ID
router.get('/resumes/detail/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id)
      .populate('templateId', 'title url tags');
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.status(200).json(resume);
  } catch (err) {
    console.error('Error fetching resume:', err);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Delete a resume
router.delete('/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (err) {
    console.error('Error deleting resume:', err);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

module.exports = router;