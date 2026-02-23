const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');

// Public route for creating booking (no authentication required)
router.post('/', validateBooking, bookingController.createBooking);

// Protected routes
router.get('/my-bookings', authenticateToken, bookingController.getUserBookings);
router.get('/:id', authenticateToken, bookingController.getBookingById);
router.put('/:id', authenticateToken, bookingController.updateBooking);
// Cancel booking
router.patch('/:id/cancel', authenticateToken, bookingController.cancelBooking);

// Download ticket
router.get('/:id/download', bookingController.downloadTicket);

module.exports = router;
