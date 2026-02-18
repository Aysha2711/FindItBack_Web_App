const Sequelize = require('sequelize');
const sequelize = require('./config/database');
const VerifyLost = require('./models/VerifyLost');
const VerifyFound = require('./models/VerifyFound');

async function checkIsolation() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const lostClaims = await VerifyLost.findAll();
        const foundClaims = await VerifyFound.findAll();

        console.log('\n--- VerifyLost Claims ---');
        lostClaims.forEach(c => console.log(`ID: ${c.id}, LostItemID: ${c.lost_item_id}, UserID (Claimant): ${c.user_id}, Status: ${c.status}`));

        console.log('\n--- VerifyFound Claims ---');
        foundClaims.forEach(c => console.log(`ID: ${c.id}, FoundItemID: ${c.found_item_id}, UserID (Claimant): ${c.user_id}, Status: ${c.status}`));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkIsolation();
