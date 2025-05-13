const Fleet = require('../models/Fleet');

// GET /api/charts/fleet/:name
exports.getFleetCharts = async (req, res) => {
  try {
    const fleetName = req.params.name;
    const fleet = await Fleet.findOne({ name: fleetName });
    if (!fleet) {
      return res.status(404).json({ message: 'Fleet not found' });
    }
    res.json(fleet.charts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/charts/compare
// Expects: { fleet: string, categories: string[] }
exports.compareCharts = async (req, res) => {
  try {
    const { fleet, categories } = req.body;
    const fleetDoc = await Fleet.findOne({ name: fleet });
    if (!fleetDoc) {
      console.log("Fleet not found:", fleet);
      return res.status(404).json({ message: 'Fleet not found' });
    }
    console.log("Fleet found:", fleetDoc.name);
    const result = categories.map(category => {
      const chart = fleetDoc.charts.find(c => c.category === category);
      if (!chart) console.log("Chart not found:", category);
      return chart ? { category: chart.category, data: chart.data, summary: chart.summary } : null;
    }).filter(Boolean);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
