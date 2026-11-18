/**
 * Bharat Bhojan - Central Error Handling Middleware
 * Prevents application crashes and returns clean, uniform JSON error responses.
 */

function errorHandler(err, req, res, next) {
    console.error('Unhandled Application Error:', err.stack || err.message);

    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'An unexpected internal server error occurred.';

    res.status(statusCode).json({
        success: false,
        error: {
            message: message,
            status: statusCode
        }
    });
}

function notFoundHandler(req, res, next) {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            error: {
                message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
                status: 404
            }
        });
    }

    // Serve custom 404 page for browser requests
    res.status(404).sendFile(require('path').join(__dirname, '..', 'public', '404.html'));
}

module.exports = {
    errorHandler,
    notFoundHandler
};
