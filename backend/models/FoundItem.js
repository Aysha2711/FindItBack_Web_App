const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const FoundItem = sequelize.define('found_item', {
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
        defaultValue: 'Pending' // Active, Claimed
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    successful_claim_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});


const User = require('./User');
FoundItem.belongsTo(User, { foreignKey: 'user_id' });

module.exports = FoundItem;

