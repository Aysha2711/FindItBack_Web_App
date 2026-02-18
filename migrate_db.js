const sequelize = require('./backend/config/database');

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Explicitly check for phone_number column and add it if missing
        await sequelize.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(255) NULL;");
        console.log('Migration successful: phone_number column checked/added.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
