require('dotenv').config();
const sequelize = require('./config/database');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const User = require('./models/User');

async function checkItems() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const users = await User.findAll();
        console.log('\n--- Users ---');
        users.forEach(u => console.log(`ID: ${u.id}, Name: ${u.name}, Email: ${u.email}`));

        const lostItems = await LostItem.findAll();
        console.log('\n--- Lost Items ---');
        lostItems.forEach(item => console.log(`ID: ${item.id}, Name: ${item.name}, UserID: ${item.user_id}, Status: ${item.status}`));

        const foundItems = await FoundItem.findAll();
        console.log('\n--- Found Items ---');
        foundItems.forEach(item => console.log(`ID: ${item.id}, Name: ${item.name}, UserID: ${item.user_id}, Status: ${item.status}`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkItems();
