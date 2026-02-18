const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = require('../middleware/authMiddleware');

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone_number } = req.body;
        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({ name, email, password, phone_number });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.status === 'Block') {
            return res.status(403).json({ message: 'Your account has been blocked by admin' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ where: { email } });

        if (!admin || admin.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT for Admin
        const token = jwt.sign(
            { id: admin.id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Admin Login successful',
            token,
            admin: { id: admin.id, email: admin.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Profile by ID
router.get('/user/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: ['id', 'name', 'email', 'phone_number'] // Only return necessary fields
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Retrieved user data from DB for ID:', id, user.toJSON());
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update User Profile
router.put('/user/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone_number } = req.body;

        console.log('Received profile update request for ID:', id, { name, email, phone_number });

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (phone_number !== undefined) updateData.phone_number = phone_number;

        console.log('Update payload for Sequelize:', updateData);

        await User.update(updateData, { where: { id } });

        const updatedUser = await User.findByPk(id, {
            attributes: ['id', 'name', 'email', 'phone_number']
        });

        console.log('Updated user data fetched from DB:', updatedUser.toJSON());
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

