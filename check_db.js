const User = require('./backend/models/User');
const sequelize = require('./backend/config/database');

async function check() {
    try {
        await sequelize.authenticate();
        const user = await User.describe();
        console.log('User Table Description:', JSON.stringify(user, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

check();
