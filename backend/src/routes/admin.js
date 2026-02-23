const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateRoute } = require('../middleware/validation');

// Apply authentication and admin middleware to all routes
router.use(authenticateToken, requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Booking management
router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:id', adminController.updateBooking);
router.delete('/bookings/:id', adminController.deleteBooking);

// Route management
router.get('/routes', adminController.getAllRoutes);
router.post('/routes', validateRoute, adminController.createRoute);
router.put('/routes/:id', validateRoute, adminController.updateRoute);
router.delete('/routes/:id', adminController.deleteRoute);

module.exports = router;
