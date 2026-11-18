/**
 * Bharat Bhojan - Admin Setup Utility
 * Creates or resets an administrator account.
 * Usage:
 *   node database/create-admin.js <username> <password>
 * or defaults to .env credentials:
 *   npm run create-admin
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { getDb } = require('../config/database');

const username = process.argv[2] || process.env.DEFAULT_ADMIN_USERNAME || 'admin';
const password = process.argv[3] || process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

if (!username || !password) {
    console.error('Error: Please provide both username and password.');
    console.error('Usage: node database/create-admin.js <username> <password>');
    process.exit(1);
}

try {
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    const existing = getDb().prepare('SELECT id FROM admins WHERE username = ?').get(username);

    if (existing) {
        getDb().prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(passwordHash, existing.id);
        console.log(`✓ Password successfully reset for existing admin: "${username}"`);
    } else {
        getDb().prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(username, passwordHash);
        console.log(`✓ New admin account created: "${username}"`);
    }
} catch (error) {
    console.error('Failed to create/reset admin account:', error.message);
    process.exit(1);
}
