const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const emailRoutes = require('./routes/emailRoutes');
const adminSettingsRoutes = require('./routes/adminSettingsRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

app.use('/api', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api', emailRoutes);
app.use('/api/admin', adminSettingsRoutes);

sequelize.sync({ alter: true })
    .then(async () => {
        console.log('Database connected and tables created');
        // Force check for phone_number column
        try {
            await sequelize.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(255) NULL;");
            console.log("Checked/added phone_number column to users table.");
        } catch (e) {
            console.warn("Could not execute manual ALTER TABLE (might already exist or dialect doesn't support IF NOT EXISTS):", e.message);
        }
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });
