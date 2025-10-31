import mongoose, { Schema, models } from "mongoose";

const ChartSchema = new Schema({
  category: String,
  data: [Number],
  summary: String,
});

const FleetSchema = new Schema({
  name: { type: String, required: true, unique: true },
  charts: [ChartSchema],
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

export default models.Fleet || mongoose.model("Fleet", FleetSchema);


