require('dotenv').config();
const sequelize = require('./config/database');
const VerifyLost = require('./models/VerifyLost');
const VerifyFound = require('./models/VerifyFound');

async function checkSchema() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const queryInterface = sequelize.getQueryInterface();

        console.log('\n--- verify_lost columns ---');
        const lostCols = await queryInterface.describeTable('verify_losts');
        console.log(Object.keys(lostCols));

        console.log('\n--- verify_found columns ---');
        const foundCols = await queryInterface.describeTable('verify_founds');
        console.log(Object.keys(foundCols));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkSchema();
