const mongoose = require('mongoose');

const ChartSchema = new mongoose.Schema({
  category: String, // e.g., "Revenue Growth"
  data: [Number],   // e.g., [100, 120, 130, ...]
  summary: String,  // e.g., "Revenue increased by 20% this month"
});

const FleetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Zomato Fleet Pune"
  charts: [ChartSchema], // Array of chart objects
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Fleet', FleetSchema);
