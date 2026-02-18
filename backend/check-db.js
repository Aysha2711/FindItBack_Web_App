require('dotenv').config();
const sequelize = require('./config/database');
// Import models to ensure they are registered with the sequelize instance
const User = require('./models/User');
const Admin = require('./models/Admin');

async function testConnection() {
    try {
        console.log('--- Authenticating ---');
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        console.log('--- Syncing Models ---');
        // Force true will DROP existing tables and CREATE new ones. 
        // Use ONLY for testing initial setup if tables are missing.
        // For now, let's use force: false to just create if missing.
        await sequelize.sync({ force: false });
        console.log('All models were synchronized successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

testConnection();
