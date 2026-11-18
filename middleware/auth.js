/**
 * Bharat Bhojan - Authentication Middleware
 * Protects administrative routes by verifying active admin session.
 */

function requireAdmin(req, res, next) {
    if (req.session && req.session.adminUser) {
        // User is authenticated, proceed to next handler
        return next();
    }

    // Check if request is an API call
    const isApiRequest = req.xhr ||
        (req.originalUrl && req.originalUrl.startsWith('/api/')) ||
        (req.baseUrl && req.baseUrl.startsWith('/api/')) ||
        (req.path && req.path.startsWith('/api/')) ||
        (req.headers.accept && req.headers.accept.includes('json'));

    if (isApiRequest) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. Please log in as administrator.'
        });
    }

    // For HTML page requests, redirect to login page
    res.redirect('/admin/login.html');
}

module.exports = {
    requireAdmin
};
