const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  authority: { type: String, enum: ['FM', 'HQM'], required: true },
  // For FM: only one location or one fleet; for HQM: can be null
  location: { type: String }, // e.g., 'Pune' (for FM only)
  fleet: { type: String },    // e.g., 'Zomato Fleet Pune' (for FM only, optional)
});

module.exports = mongoose.model('User', UserSchema); 