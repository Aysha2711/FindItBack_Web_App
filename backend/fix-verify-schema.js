require('dotenv').config();
const sequelize = require('./config/database');
const { DataTypes } = require('sequelize');

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const queryInterface = sequelize.getQueryInterface();

        console.log('Adding user_id to verify_losts...');
        try {
            await queryInterface.addColumn('verify_losts', 'user_id', {
                type: DataTypes.INTEGER,
                allowNull: true
            });
            console.log('Added user_id to verify_losts');
        } catch (e) {
            console.log('user_id might already exist or table missing in verify_losts:', e.message);
        }

        console.log('Adding user_id to verify_founds...');
        try {
            await queryInterface.addColumn('verify_founds', 'user_id', {
                type: DataTypes.INTEGER,
                allowNull: true
            });
            console.log('Added user_id to verify_founds');
        } catch (e) {
            console.log('user_id might already exist or table missing in verify_founds:', e.message);
        }

    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
