const Sequelize = require('sequelize');
const sequelize = require('./config/database');
const VerifyLost = require('./models/VerifyLost');
const VerifyFound = require('./models/VerifyFound');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const User = require('./models/User');

async function debugClaims() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Test the association that was missing
        console.log('\n--- Testing LostItem -> User association ---');
        const lostItems = await LostItem.findAll({ include: [{ model: User, attributes: ['name'] }] });
        console.log(`Found ${lostItems.length} lost items with user info.`);

        console.log('\n--- Testing FoundItem -> User association ---');
        const foundItems = await FoundItem.findAll({ include: [{ model: User, attributes: ['name'] }] });
        console.log(`Found ${foundItems.length} found items with user info.`);

        const userId = 2; // Test with the user ID we saw in the previous run
        const lostClaims = await VerifyLost.findAll({ where: { user_id: userId } });
        const foundClaims = await VerifyFound.findAll({ where: { user_id: userId } });

        console.log(`\nUser 2 claims: Lost=${lostClaims.length}, Found=${foundClaims.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Error during debug:', error);
        process.exit(1);
    }
}

debugClaims();
