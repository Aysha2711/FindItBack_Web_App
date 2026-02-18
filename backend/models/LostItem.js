const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const LostItem = sequelize.define('lost_item', {
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
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    area: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true
    },
    exact_location: {
        type: Sequelize.STRING, // Private
        allowNull: true
    },
    contact_info: {
        type: Sequelize.STRING, // Private
        allowNull: false
    },
    admin_notes: {
        type: Sequelize.TEXT, // Optional
        allowNull: true
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'Pending' // Active, Resolved
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: true // Check if we want to enforce login
    },
    successful_claim_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});


const User = require('./User');
LostItem.belongsTo(User, { foreignKey: 'user_id' });

module.exports = LostItem;

