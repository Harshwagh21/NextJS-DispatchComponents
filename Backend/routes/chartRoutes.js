const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');
const authenticateToken = require('../middleware/authMiddleware');

// Debug: Log all requests to this router
router.use((req, res, next) => {
  console.log(`[CHART ROUTES] ${req.method} ${req.path}`);
  next();
});

// GET /api/charts/fleets - MUST come before /fleet/:name to avoid route conflicts
router.get('/fleets', authenticateToken, chartController.getFleetsForUser);

// GET /api/charts/fleet/:name
router.get('/fleet/:name', chartController.getFleetCharts);

// POST /api/charts/compare
router.post('/compare', chartController.compareCharts);

// Debug route
router.get('/test', (req, res) => {
  res.json({ message: 'Chart routes are working', path: '/api/charts/test' });
});

module.exports = router;
