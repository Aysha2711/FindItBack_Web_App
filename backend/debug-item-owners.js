const Sequelize = require('sequelize');
const sequelize = require('./config/database');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');

async function debugItemsOwners() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const lostItems = await LostItem.findAll({ attributes: ['id', 'name', 'user_id'] });
        const foundItems = await FoundItem.findAll({ attributes: ['id', 'name', 'user_id'] });

        console.log('\n--- LostItems (ID, Name, OwnerID) ---');
        lostItems.forEach(i => console.log(`${i.id}: ${i.name} (Owner: ${i.user_id})`));

        console.log('\n--- FoundItems (ID, Name, OwnerID) ---');
        foundItems.forEach(i => console.log(`${i.id}: ${i.name} (Owner: ${i.user_id})`));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugItemsOwners();
