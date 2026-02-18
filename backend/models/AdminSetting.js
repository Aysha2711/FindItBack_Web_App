const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const AdminSetting = sequelize.define('admin_setting', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'finditback@lostfound.com'
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '+94 77 123 4567'
    },
    working_hours: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Mon - Fri: 9AM to 6PM'
    }
});

module.exports = AdminSetting;
