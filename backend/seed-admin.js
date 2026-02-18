const sequelize = require('./config/database');
const Admin = require('./models/Admin');

async function seedAdmin() {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const email = 'admin@gmail.com';
        const password = 'admin123'; // In a real app, hash this password!

        const existingAdmin = await Admin.findOne({ where: { email } });

        if (existingAdmin) {
            console.log('Admin user already exists.');
        } else {
            await Admin.create({
                email,
                password
            });
            console.log(`Admin user created: ${email}`);
        }

    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await sequelize.close();
    }
}

seedAdmin();
