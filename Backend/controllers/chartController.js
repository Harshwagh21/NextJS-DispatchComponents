const Fleet = require('../models/Fleet');
const User = require('../models/User');

// GET /api/charts/fleet/:name
exports.getFleetCharts = async (req, res) => {
  try {
    const fleetName = req.params.name;
    const fleet = await Fleet.findOne({ name: fleetName });
    if (!fleet) {
      return res.status(404).json({ message: 'Fleet not found' });
    }
    res.json({ charts: fleet.charts, location: fleet.location, name: fleet.name, fleetId: fleet._id});
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

// GET /api/charts/fleets
exports.getFleetsForUser = async (req, res) => {
  try {
    console.log('getFleetsForUser called');
    console.log('User from token:', req.user);
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user.email, 'Authority:', user.authority);
    let fleets;
    if (user.authority === 'HQM') {
      fleets = await Fleet.find({});
      console.log('HQM user - returning all fleets:', fleets.length);
    } else if (user.authority === 'FM') {
      // FM can see only fleets for their location
      if (user.location) {
        fleets = await Fleet.find({ 'name': { $regex: user.location, $options: 'i' } });
        console.log('FM user with location - returning fleets:', fleets.length);
      } else if (user.fleet) {
        fleets = await Fleet.find({ name: user.fleet });
        console.log('FM user with fleet - returning fleets:', fleets.length);
      } else {
        fleets = [];
        console.log('FM user with no location/fleet - returning empty');
      }
    } else {
      fleets = [];
      console.log('Unknown authority - returning empty');
    }
    console.log('Returning fleets:', fleets.map(f => f.name));
    res.json(fleets);
  } catch (err) {
    console.error('Error in getFleetsForUser:', err);
    res.status(500).json({ message: err.message });
  }
};

// (duplicate compareCharts removed)
