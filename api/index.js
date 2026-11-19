/**
 * Vercel Serverless Function Entry Point for Bharat Bhojan
 */
const { app } = require('../server');

module.exports = (req, res) => {
    // Vercel rewrites change req.url to /api/index.js
    // Restore the client's actual requested URL from Vercel's x-matched-path header
    const originalUrl = req.headers['x-matched-path'] || req.headers['x-invoke-path'];
    if (originalUrl) {
        req.url = originalUrl;
    }
    return app(req, res);
};
