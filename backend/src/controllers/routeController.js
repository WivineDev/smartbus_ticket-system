const Route = require('../models/Route');

// Search routes publicly
const searchRoutes = async (req, res) => {
    try {
        const { departure, destination } = req.query;

        // Default to empty strings if not provided for 'search' behavior
        const result = await Route.search(departure || '', destination || '');

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to search routes',
                error: result.error
            });
        }

        res.status(200).json({
            success: true,
            data: result.routes
        });
    } catch (error) {
        console.error('Search routes error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all routes publicly (for dropdowns etc)
const getAllRoutes = async (req, res) => {
    try {
        const result = await Route.getAll();

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve routes',
                error: result.error
            });
        }

        res.status(200).json({
            success: true,
            data: result.routes
        });
    } catch (error) {
        console.error('Get all routes error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    searchRoutes,
    getAllRoutes
};
