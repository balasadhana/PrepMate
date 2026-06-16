const express = require('express');
const router = express.Router();
const ResumeTemplate = require('../models/ResumeTemplate');
const Tip = require('../models/Tip');
const User = require('../models/User');
const Material = require('../models/Material');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Experience = require('../models/Experience');

// Upload a new resume template
router.post('/resume-templates', async (req, res) => {
  try {
    const { title, url, tags } = req.body;
    const newTemplate = new ResumeTemplate({ title, url, tags });
    await newTemplate.save();
    res.status(201).json({ message: 'Template uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload template' });
  }
});

// Get all templates
router.get('/resume-templates', async (req, res) => {
  try {
    const templates = await ResumeTemplate.find();
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Delete a template by ID
router.delete('/resume-templates/:id', async (req, res) => {
  try {
    await ResumeTemplate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

// Upload a new interview tip
router.post('/tips/upload', async (req, res) => {
  try {
    const { title, content, category, createdBy } = req.body;
    
    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({ 
        error: 'Title, content, and category are required' 
      });
    }

    const newTip = new Tip({ 
      title, 
      content, 
      category, 
      createdBy: createdBy || 'admin' 
    });
    await newTip.save();
    
    res.status(201).json({ 
      message: 'Tip uploaded successfully',
      tip: newTip
    });
  } catch (err) {
    console.error('Error uploading tip:', err);
    res.status(500).json({ error: 'Failed to upload tip' });
  }
});

// Get all tips
router.get('/tips', async (req, res) => {
  try {
    const tips = await Tip.find().sort({ uploadedAt: -1 });
    res.status(200).json(tips);
  } catch (err) {
    console.error('Error fetching tips:', err);
    res.status(500).json({ error: 'Failed to fetch tips' });
  }
});

// Delete a tip by ID
router.delete('/tips/:id', async (req, res) => {
  try {
    const tip = await Tip.findByIdAndDelete(req.params.id);
    if (!tip) {
      return res.status(404).json({ error: 'Tip not found' });
    }
    res.status(200).json({ message: 'Tip deleted successfully' });
  } catch (err) {
    console.error('Error deleting tip:', err);
    res.status(500).json({ error: 'Failed to delete tip' });
  }
});

// Get all users with filtering
router.get('/users', async (req, res) => {
  try {
    const { role, search } = req.query;
    
    let filter = {};
    
    // Filter by role
    if (role) {
      filter.role = role;
    }
    
    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Approve user
router.patch('/users/:id/approve', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User approved successfully',
      user,
    });
  } catch (err) {
    console.error('Error approving user:', err);
    res.status(500).json({ error: 'Failed to approve user' });
  }
});


// Upload a new study material
router.post('/materials/upload', async (req, res) => {
  try {
    console.log('Received material upload request:', req.body);
    const { title, category, description, fileUrl, tags, status } = req.body;
    
    // Validate required fields
    if (!title || !category || !description || !fileUrl) {
      return res.status(400).json({ 
        error: 'Title, category, description, and file URL are required' 
      });
    }

    // Validate category
    const validCategories = ['Technical', 'Aptitude', 'Shortcuts', 'Interview Questions'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        error: 'Invalid category. Must be one of: Technical, Aptitude, Shortcuts, Interview Questions' 
      });
    }

    // Validate status
    const validStatuses = ['Active', 'Inactive'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be Active or Inactive' 
      });
    }

    // Process tags
    const processedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const newMaterial = new Material({
      title,
      category,
      description,
      fileUrl,
      tags: processedTags,
      status: status || 'Active'
      // uploadedBy will be null for now, can be updated when auth is implemented
    });

    console.log('Saving material to database...');
    await newMaterial.save();
    console.log('Material saved successfully:', newMaterial);
    
    res.status(201).json({ 
      message: 'Material uploaded successfully',
      material: newMaterial
    });
  } catch (err) {
    console.error('Error uploading material:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: 'Failed to upload material', details: err.message });
  }
});

// Get all materials
router.get('/materials', async (req, res) => {
  try {
    const materials = await Material.find().sort({ uploadedAt: -1 });
    res.status(200).json(materials);
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Delete a material by ID
router.delete('/materials/:id', async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (err) {
    console.error('Error deleting material:', err);
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

// Update material status
router.patch('/materials/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Active or Inactive' });
    }

    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.status(200).json({ 
      message: 'Material status updated successfully',
      material 
    });
  } catch (err) {
    console.error('Error updating material status:', err);
    res.status(500).json({ error: 'Failed to update material status' });
  }
});

// ==================== QUIZ ROUTES ====================

// Create a new quiz question
router.post('/quizzes', async (req, res) => {
  try {
    const { question, options, correctAnswer, domain, explanation } = req.body;
    
    // Validate required fields
    if (!question || !domain || !correctAnswer) {
      return res.status(400).json({ 
        error: 'Question, domain, and correct answer are required' 
      });
    }

    // Validate options
    if (!Array.isArray(options) || options.length !== 4 || options.some(opt => !opt.trim())) {
      return res.status(400).json({ 
        error: 'Exactly 4 non-empty options are required' 
      });
    }

    // Validate domain
    const validDomains = ['DBMS', 'DSA', 'Frontend', 'Backend', 'System Design', 'Other'];
    if (!validDomains.includes(domain)) {
      return res.status(400).json({ 
        error: 'Invalid domain. Must be one of: ' + validDomains.join(', ')
      });
    }

    // Validate correct answer
    const validAnswers = ['A', 'B', 'C', 'D'];
    if (!validAnswers.includes(correctAnswer)) {
      return res.status(400).json({ 
        error: 'Correct answer must be one of: A, B, C, D' 
      });
    }

    const newQuiz = new Quiz({
      question,
      options,
      correctAnswer,
      domain,
      explanation: explanation || '',
      status: 'Active',
      createdBy: '507f1f77bcf86cd799439011' // Mock admin ID
    });

    await newQuiz.save();
    
    res.status(201).json({ 
      message: 'Quiz question created successfully',
      quiz: newQuiz
    });
  } catch (err) {
    console.error('Error creating quiz question:', err);
    res.status(500).json({ error: 'Failed to create quiz question' });
  }
});

// Get all quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get quiz by ID
router.get('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'username email');
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    res.status(200).json(quiz);
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Update quiz
router.put('/quizzes/:id', async (req, res) => {
  try {
    const { question, options, correctAnswer, domain, explanation } = req.body;
    
    const updateData = {};
    if (question) updateData.question = question;
    if (options) {
      if (!Array.isArray(options) || options.length !== 4 || options.some(opt => !opt.trim())) {
        return res.status(400).json({ 
          error: 'Exactly 4 non-empty options are required' 
        });
      }
      updateData.options = options;
    }
    if (correctAnswer) {
      const validAnswers = ['A', 'B', 'C', 'D'];
      if (!validAnswers.includes(correctAnswer)) {
        return res.status(400).json({ 
          error: 'Correct answer must be one of: A, B, C, D' 
        });
      }
      updateData.correctAnswer = correctAnswer;
    }
    if (domain) {
      const validDomains = ['DBMS', 'DSA', 'Frontend', 'Backend', 'System Design', 'Other'];
      if (!validDomains.includes(domain)) {
        return res.status(400).json({ 
          error: 'Invalid domain. Must be one of: ' + validDomains.join(', ')
        });
      }
      updateData.domain = domain;
    }
    if (explanation !== undefined) updateData.explanation = explanation;

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.status(200).json({ 
      message: 'Quiz updated successfully',
      quiz 
    });
  } catch (err) {
    console.error('Error updating quiz:', err);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// Delete quiz question
router.delete('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz question not found' });
    }

    res.status(200).json({ message: 'Quiz question deleted successfully' });
  } catch (err) {
    console.error('Error deleting quiz question:', err);
    res.status(500).json({ error: 'Failed to delete quiz question' });
  }
});

// Update quiz question status
router.patch('/quizzes/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Active or Inactive' });
    }

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz question not found' });
    }

    res.status(200).json({ 
      message: 'Quiz question status updated successfully',
      quiz 
    });
  } catch (err) {
    console.error('Error updating quiz question status:', err);
    res.status(500).json({ error: 'Failed to update quiz question status' });
  }
});

// ==================== EXPERIENCE APPROVAL ROUTES ====================

// Get all experiences with filtering
router.get('/experiences', async (req, res) => {
  try {
    const { status, company, position } = req.query;
    
    let filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (company) {
      filter.company = { $regex: company, $options: 'i' };
    }
    
    if (position) {
      filter.position = { $regex: position, $options: 'i' };
    }
    
    const experiences = await Experience.find(filter)
      .populate('userId', 'name email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json(experiences);
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// Get experience by ID
router.get('/experiences/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('approvedBy', 'name');
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    
    res.status(200).json(experience);
  } catch (err) {
    console.error('Error fetching experience:', err);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// Approve experience
router.patch('/experiences/:id/approve', async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        approvedBy: req.body.adminId || 'admin', // Will be updated when auth is implemented
        approvedAt: Date.now()
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.status(200).json({ 
      message: 'Experience approved successfully',
      experience 
    });
  } catch (err) {
    console.error('Error approving experience:', err);
    res.status(500).json({ error: 'Failed to approve experience' });
  }
});

// Reject experience
router.patch('/experiences/:id/reject', async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Rejected',
        rejectionReason,
        approvedBy: req.body.adminId || 'admin', // Will be updated when auth is implemented
        approvedAt: Date.now()
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.status(200).json({ 
      message: 'Experience rejected successfully',
      experience 
    });
  } catch (err) {
    console.error('Error rejecting experience:', err);
    res.status(500).json({ error: 'Failed to reject experience' });
  }
});

// Delete experience
router.delete('/experiences/:id', async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (err) {
    console.error('Error deleting experience:', err);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// Get experience statistics
router.get('/experiences/stats/summary', async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      Experience.countDocuments(),
      Experience.countDocuments({ status: 'Pending' }),
      Experience.countDocuments({ status: 'Approved' }),
      Experience.countDocuments({ status: 'Rejected' })
    ]);

    res.status(200).json({
      total,
      pending,
      approved,
      rejected
    });
  } catch (err) {
    console.error('Error fetching experience stats:', err);
    res.status(500).json({ error: 'Failed to fetch experience statistics' });
  }
});

module.exports = router;
