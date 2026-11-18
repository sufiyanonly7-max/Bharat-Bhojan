/**
 * Bharat Bhojan - Administrative Routes
 * Session login/logout and protected CRUD operations.
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

// Public admin authentication endpoints
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.get('/check-auth', adminController.checkAuth);

// Protected routes (require active admin session)
router.get('/dashboard', requireAdmin, adminController.getDashboard);
router.get('/foods/:id', requireAdmin, adminController.getFoodById);
router.post('/foods', requireAdmin, adminController.createFood);
router.put('/foods/:id', requireAdmin, adminController.updateFood);
router.delete('/foods/:id', requireAdmin, adminController.deleteFood);

module.exports = router;
