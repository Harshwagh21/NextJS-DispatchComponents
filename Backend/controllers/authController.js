const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Replace with your own secret in production!
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  console.log('BODY:', req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // For demo: plain text password check. In production, use bcrypt!
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Create JWT
    const token = jwt.sign({ userId: user._id, authority: user.authority }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { _id: user._id, username: user.username, email: user.email, authority: user.authority, location: user.location, fleet: user.fleet } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.username, email: user.email, authority: user.authority, location: user.location, fleet: user.fleet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 