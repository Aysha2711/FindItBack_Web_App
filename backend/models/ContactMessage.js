const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const ContactMessage = sequelize.define('contact_message', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    subject: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Contact Inquiry'
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

module.exports = ContactMessage;
