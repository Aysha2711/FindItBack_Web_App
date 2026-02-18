const Sequelize = require('sequelize');
const sequelize = require('./config/database');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');

async function debugItems() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const lostItems = await LostItem.findAll({ attributes: ['id', 'name'] });
        const foundItems = await FoundItem.findAll({ attributes: ['id', 'name'] });

        console.log('\n--- LostItems (ID, Name) ---');
        lostItems.forEach(i => console.log(`${i.id}: ${i.name}`));

        console.log('\n--- FoundItems (ID, Name) ---');
        foundItems.forEach(i => console.log(`${i.id}: ${i.name}`));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugItems();
