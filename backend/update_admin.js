const { pool } = require('./src/config/database.js');
const bcrypt = require('bcryptjs');

async function updatePassword() {
    try {
        const password = 'admin123';
        const hash = await bcrypt.hash(password, 12);
        console.log('Generated new hash for admin123');

        const [result] = await pool.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hash, 'admin@smartbus.com']
        );

        if (result.affectedRows > 0) {
            console.log('✅ Admin password updated successfully');
        } else {
            console.log('❌ Admin user not found');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating password:', error.message);
        process.exit(1);
    }
}

updatePassword();
