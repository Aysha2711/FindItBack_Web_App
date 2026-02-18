const sequelize = require('./config/database');
const VerifyLost = require('./models/VerifyLost');
const VerifyFound = require('./models/VerifyFound');

async function cleanupOrphans() {
    try {
        await sequelize.authenticate();
        const deletedLost = await VerifyLost.destroy({ where: { user_id: null } });
        const deletedFound = await VerifyFound.destroy({ where: { user_id: null } });
        console.log(`Deleted ${deletedLost} orphan lost claims.`);
        console.log(`Deleted ${deletedFound} orphan found claims.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

cleanupOrphans();
