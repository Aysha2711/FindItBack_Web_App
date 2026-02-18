require('dotenv').config();
const sequelize = require('./config/database');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const VerifyLost = require('./models/VerifyLost');
const VerifyFound = require('./models/VerifyFound');

async function debugAll() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const lostItems = await LostItem.findAll();
        const foundItems = await FoundItem.findAll();
        const lostClaims = await VerifyLost.findAll();
        const foundClaims = await VerifyFound.findAll();

        console.log('\n--- ALL Lost Items ---');
        lostItems.forEach(i => console.log(`  ID: ${i.id}, Name: ${i.name}, Owner: ${i.user_id}`));

        console.log('\n--- ALL Found Items ---');
        foundItems.forEach(i => console.log(`  ID: ${i.id}, Name: ${i.name}, Owner: ${i.user_id}`));

        console.log('\n--- ALL VerifyLost Claims (Found by someone) ---');
        lostClaims.forEach(c => console.log(`  ID: ${c.id}, ItemID: ${c.lost_item_id}, Claimant: ${c.user_id}, Status: ${c.status}`));

        console.log('\n--- ALL VerifyFound Claims (Lost by someone) ---');
        foundClaims.forEach(c => console.log(`  ID: ${c.id}, ItemID: ${c.found_item_id}, Claimant: ${c.user_id}, Status: ${c.status}`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

debugAll();
