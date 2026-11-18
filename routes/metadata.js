/**
 * Bharat Bhojan - Metadata Routes
 * Endpoints for states, regions, categories, seasons, references, and platform stats.
 */

const express = require('express');
const router = express.Router();
const metadataController = require('../controllers/metadataController');

// GET /api/states - All states with food counts
router.get('/states', metadataController.getStates);

// GET /api/regions - All geographic regions with descriptions & counts
router.get('/regions', metadataController.getRegions);

// GET /api/categories - All food categories with counts
router.get('/categories', metadataController.getCategories);

// GET /api/seasons - All seasonal categories with counts
router.get('/seasons', metadataController.getSeasons);

// GET /api/references - Bibliographic and institutional references
router.get('/references', metadataController.getReferences);

// GET /api/stats - High-level summary metrics
router.get('/stats', metadataController.getStats);

module.exports = router;
