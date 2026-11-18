/**
 * Bharat Bhojan - Database Configuration
 * Uses Node.js native SQLite (node:sqlite) module.
 * No external native binaries required - 100% portable and local.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

// Path to SQLite database file
const dbDirectory = path.join(__dirname, '..', 'database');
let dbPath = path.join(dbDirectory, 'bharat_bhojan.db');

// In serverless environments (like Vercel or AWS Lambda), the deployment directory is read-only.
// If running on Vercel, copy the pre-seeded database to /tmp so SQLite can open and operate normally.
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
if (isServerless) {
    const tmpDbPath = path.join('/tmp', 'bharat_bhojan.db');
    if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(dbPath)) {
            try {
                fs.copyFileSync(dbPath, tmpDbPath);
            } catch (err) {
                console.error('Failed to copy database to /tmp:', err.message);
            }
        }
    }
    dbPath = tmpDbPath;
}

// Ensure database directory exists if not serverless
if (!isServerless && !fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
}

// Initialize database instance
let db;
try {
    db = new DatabaseSync(dbPath);
    // Enforce foreign key constraints
    db.exec('PRAGMA foreign_keys = ON;');
} catch (error) {
    console.error('Failed to initialize SQLite database:', error.message);
    throw error;
}

/**
 * Execute a query that returns multiple rows
 * @param {string} sql - Parameterized SQL query
 * @param {Array} params - Array of parameters
 * @returns {Array} List of rows
 */
function queryAll(sql, params = []) {
    try {
        const stmt = db.prepare(sql);
        return stmt.all(...params);
    } catch (error) {
        console.error('Database queryAll error:', error.message, 'SQL:', sql);
        throw error;
    }
}

/**
 * Execute a query that returns a single row
 * @param {string} sql - Parameterized SQL query
 * @param {Array} params - Array of parameters
 * @returns {Object|undefined} Row object or undefined
 */
function queryOne(sql, params = []) {
    try {
        const stmt = db.prepare(sql);
        return stmt.get(...params);
    } catch (error) {
        console.error('Database queryOne error:', error.message, 'SQL:', sql);
        throw error;
    }
}

/**
 * Execute an INSERT, UPDATE, or DELETE query
 * @param {string} sql - Parameterized SQL statement
 * @param {Array} params - Array of parameters
 * @returns {Object} Result with changes and lastInsertRowid
 */
function execute(sql, params = []) {
    try {
        const stmt = db.prepare(sql);
        return stmt.run(...params);
    } catch (error) {
        console.error('Database execute error:', error.message, 'SQL:', sql);
        throw error;
    }
}

/**
 * Execute raw multi-statement SQL script (used for schema creation)
 * @param {string} sqlScript
 */
function execScript(sqlScript) {
    try {
        db.exec(sqlScript);
    } catch (error) {
        console.error('Database execScript error:', error.message);
        throw error;
    }
}

/**
 * Run operations within a transaction
 * @param {Function} callback - Function containing queries to run
 */
function transaction(callback) {
    db.exec('BEGIN TRANSACTION;');
    try {
        const result = callback();
        db.exec('COMMIT;');
        return result;
    } catch (error) {
        db.exec('ROLLBACK;');
        throw error;
    }
}

module.exports = {
    db,
    queryAll,
    queryOne,
    execute,
    execScript,
    transaction,
    getDb: () => db
};
