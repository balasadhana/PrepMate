const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure role is included in the schema

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user or admin
 * @access  Public
 */
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate role (must be 'user' or 'admin')
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user/admin with role
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role, // ✅ Save the role
    });

    await newUser.save();

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login a user or admin
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[AUTH] Login attempt for email: "${email}" with password length: ${password ? password.length : 0}`);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[AUTH] User not found for email: "${email}"`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ LOG ROLE FOR DEBUGGING
    console.log(`[AUTH] User found: ${user.username}, Role: ${user.role}, Stored Hash: ${user.password}`);

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`[AUTH] Password match result: ${isMatch}`);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with role in payload
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role, // ✅ Include role in token
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`[AUTH] Login successful for: ${user.email}`);

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
