const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const VerifyLost = sequelize.define('verify_lost', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    lost_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'lost_items',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },

    found_location: {
        type: Sequelize.STRING,
        allowNull: false
    },
    found_date: {
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
        allowNull: false, // Make it mandatory for account linking
        references: {
            model: 'users',
            key: 'id'
        }
    }
});



const User = require('./User');
VerifyLost.belongsTo(User, { foreignKey: 'user_id' });

module.exports = VerifyLost;

