const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Material = require('../models/Material');
// const auth = require('../middleware/auth'); // TODO: Implement auth middleware

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/materials';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'text/plain',
    'image/jpeg',
    'image/png',
    'video/mp4',
    'audio/mpeg'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, PPT, PPTX, TXT, JPG, PNG, MP4, MP3 files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// GET /api/materials - Fetch all study materials (public)
router.get('/', async (req, res) => {
  try {
    const { subject, search, sort = 'uploadedAt', order = 'desc', page = 1, limit = 12 } = req.query;
    
    // Build query
    let query = { isPublic: true };
    
    if (subject && subject !== 'all') {
      query.subject = subject;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
         const materials = await Material.find(query)
       .sort(sortObj)
       .skip(skip)
       .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Material.countDocuments(query);
    
    // Get unique subjects for filter
    const subjects = await Material.distinct('subject', { isPublic: true });
    
    res.json({
      materials,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      subjects: subjects.sort()
    });
    
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials', details: error.message });
  }
});

// GET /api/materials/:id - Fetch specific material
router.get('/:id', async (req, res) => {
  try {
         const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    if (!material.isPublic) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(material);
    
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({ error: 'Failed to fetch material', details: error.message });
  }
});

// POST /api/materials - Upload new material (admin only)
// TODO: Add proper authentication middleware
router.post('/', upload.single('file'), async (req, res) => {
  try {
    // TODO: Check if user is admin when auth is implemented
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ error: 'Access denied. Admin only.' });
    // }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { title, subject, description, tags } = req.body;
    
    if (!title || !subject || !description) {
      return res.status(400).json({ error: 'Title, subject, and description are required' });
    }
    
    // Determine file type
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let fileType = 'other';
    
    if (fileExtension === '.pdf') fileType = 'pdf';
    else if (fileExtension === '.docx') fileType = 'docx';
    else if (fileExtension === '.ppt') fileType = 'ppt';
    else if (fileExtension === '.pptx') fileType = 'pptx';
    else if (fileExtension === '.txt') fileType = 'txt';
    else if (['.jpg', '.jpeg'].includes(fileExtension)) fileType = 'jpg';
    else if (fileExtension === '.png') fileType = 'png';
    else if (fileExtension === '.mp4') fileType = 'mp4';
    else if (fileExtension === '.mp3') fileType = 'mp3';
    
    const material = new Material({
      title,
      subject,
      description,
      fileUrl: `/uploads/materials/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType,
      fileSize: req.file.size,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
             uploadedBy: null // TODO: Use req.user._id when auth is implemented
    });
    
    await material.save();
    
    res.status(201).json({
      message: 'Material uploaded successfully',
      material
    });
    
  } catch (error) {
    console.error('Error uploading material:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Failed to upload material', details: error.message });
  }
});

// PUT /api/materials/:id - Update material (admin only)
// TODO: Add proper authentication middleware
router.put('/:id', async (req, res) => {
  try {
    // TODO: Check if user is admin when auth is implemented
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ error: 'Access denied. Admin only.' });
    // }
    
    const { title, subject, description, tags, isPublic } = req.body;
    
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    const updateData = {};
    if (title) updateData.title = title;
    if (subject) updateData.subject = subject;
    if (description) updateData.description = description;
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());
    if (typeof isPublic === 'boolean') updateData.isPublic = isPublic;
    
         const updatedMaterial = await Material.findByIdAndUpdate(
       req.params.id,
       updateData,
       { new: true, runValidators: true }
     );
    
    res.json({
      message: 'Material updated successfully',
      material: updatedMaterial
    });
    
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({ error: 'Failed to update material', details: error.message });
  }
});

// DELETE /api/materials/:id - Delete material (admin only)
// TODO: Add proper authentication middleware
router.delete('/:id', async (req, res) => {
  try {
    // TODO: Check if user is admin when auth is implemented
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ error: 'Access denied. Admin only.' });
    // }
    
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    // Delete file from storage
    if (material.fileUrl) {
      const filePath = path.join(__dirname, '..', material.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Material.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Material deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ error: 'Failed to delete material', details: error.message });
  }
});

// POST /api/materials/:id/download - Increment download count
router.post('/:id/download', async (req, res) => {
  try {
    await Material.findByIdAndUpdate(req.params.id, {
      $inc: { downloadCount: 1 }
    });
    
    res.json({ message: 'Download count updated' });
    
  } catch (error) {
    console.error('Error updating download count:', error);
    // Don't fail the download if this fails
    res.json({ message: 'Download count update failed' });
  }
});

// GET /api/materials/subjects - Get all available subjects
router.get('/subjects/all', async (req, res) => {
  try {
    const subjects = await Material.distinct('subject', { isPublic: true });
    res.json(subjects.sort());
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

module.exports = router;
