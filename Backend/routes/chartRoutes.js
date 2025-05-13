const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');

// GET /api/charts/fleet/:name
router.get('/fleet/:name', chartController.getFleetCharts);

// POST /api/charts/compare
router.post('/compare', chartController.compareCharts);

module.exports = router;
