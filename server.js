/**
 * Bharat Bhojan - Main Application Server
 * Academic Project #25: Traditional Indian Food Knowledge Information System
 * Built with Node.js, Express.js, and SQLite.
 */

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

// Route Handlers & Middleware
const foodsRoutes = require('./routes/foods');
const metadataRoutes = require('./routes/metadata');
const adminRoutes = require('./routes/admin');
const { requireAdmin } = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware for Admin Authentication
app.use(session({
    secret: process.env.SESSION_SECRET || 'bharat_bhojan_academic_default_secret_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours session
    }
}));

// Route guard for protected admin HTML pages
app.get(['/admin/dashboard.html', '/admin/food-form.html'], (req, res, next) => {
    if (!req.session || !req.session.adminUser) {
        return res.redirect('/admin/login.html');
    }
    next();
});

// Static Assets
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use(express.static(path.join(__dirname, 'public')));

// Friendly root URL redirection or serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register API Routes
app.use('/api/foods', foodsRoutes);
app.use('/api', metadataRoutes);
app.use('/api/admin', adminRoutes);

// Custom 404 Handler
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Express Server only when run directly
let server;
if (require.main === module) {
    server = app.listen(PORT, '127.0.0.1', () => {
        console.log('====================================================');
        console.log(` Bharat Bhojan - Server Running Successfully`);
        console.log(` Local URL: http://localhost:${PORT}`);
        console.log(` Admin Portal: http://localhost:${PORT}/admin/login.html`);
        console.log('====================================================');
    });
}

module.exports = { app, server };
