/**
 * Bharat Bhojan - Food Routes
 * Public endpoints for browsing, searching, and viewing food records.
 */

const express = require('express');
const router = express.Router();
const foodsController = require('../controllers/foodsController');

// GET /api/foods/featured - Featured dishes for home showcase
router.get('/featured', foodsController.getFeaturedFoods);

// GET /api/foods/search?q= - Textual search across names, ingredients, notes
router.get('/search', foodsController.searchFoods);

// GET /api/foods - List foods with multi-criteria filters & sorting
router.get('/', foodsController.getAllFoods);

// GET /api/foods/:slug - Detailed view of a single traditional food record
router.get('/:slug', foodsController.getFoodBySlug);

module.exports = router;
