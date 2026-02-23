const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateContact } = require('../middleware/validation');

// Public routes
router.post('/contact', validateContact, userController.submitContact);

// Public route for getting routes (no authentication required)
router.get('/routes', userController.getRoutes);
router.get('/routes/:id', userController.getRouteById);

module.exports = router;
