const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Search routes
router.get('/search', routeController.searchRoutes);

// Get all routes
router.get('/', routeController.getAllRoutes);

module.exports = router;
