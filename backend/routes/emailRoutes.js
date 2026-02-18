const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/authMiddleware');
const ContactMessage = require('../models/ContactMessage');
require('dotenv').config();

// Create Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

router.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedSubject = subject || 'Contact Inquiry';

    let savedMessage;
    try {
        savedMessage = await ContactMessage.create({
            name,
            email,
            subject: normalizedSubject,
            message
        });
    } catch (dbError) {
        console.error('Error saving contact message:', dbError);
        return res.status(500).json({ message: 'Error saving message', error: dbError.message });
    }

    const mailOptions = {
        from: email, // Sender address (user's email from form)
        to: process.env.EMAIL_USER, // Receiver address (admin/app owner)
        subject: `FindItBack Contact: ${normalizedSubject}`,
        text: `From: ${name} (${email})\nSubject: ${normalizedSubject}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully and message saved');
        res.status(201).json({ message: 'Message sent successfully', contactMessage: savedMessage });
    } catch (error) {
        console.error('Error sending email:', error);
        // Keep request successful because the message is already stored in DB.
        res.status(201).json({
            message: 'Message saved, but email notification could not be sent',
            contactMessage: savedMessage,
            warning: error.message
        });
    }
});

router.get('/contact-messages', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const messages = await ContactMessage.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error loading contact messages:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/contact-messages/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const deletedRows = await ContactMessage.destroy({
            where: { id: req.params.id }
        });

        if (!deletedRows) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
