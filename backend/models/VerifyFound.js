const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const VerifyFound = sequelize.define('verify_found', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    found_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'found_items',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },

    full_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lost_location: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lost_date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    features: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    proof_image: {
        type: Sequelize.STRING,
        allowNull: true
    },
    story: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'Pending'
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Mandatory for account linking
        references: {
            model: 'users',
            key: 'id'
        }
    }
});



const User = require('./User');
VerifyFound.belongsTo(User, { foreignKey: 'user_id' });

module.exports = VerifyFound;

