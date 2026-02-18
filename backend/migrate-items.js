require('dotenv').config();
const sequelize = require('./config/database');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const User = require('./models/User');

async function migrateItems() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Get the first user
        const user = await User.findOne();
        if (!user) {
            console.error('No users found in database. Cannot migrate items.');
            return;
        }

        console.log(`Migrating orphan items to user: ${user.name} (ID: ${user.id})`);

        const lostUpdated = await LostItem.update(
            { user_id: user.id },
            { where: { user_id: null } }
        );
        console.log(`Updated ${lostUpdated[0]} lost items.`);

        const foundUpdated = await FoundItem.update(
            { user_id: user.id },
            { where: { user_id: null } }
        );
        console.log(`Updated ${foundUpdated[0]} found items.`);

    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await sequelize.close();
    }
}

migrateItems();
