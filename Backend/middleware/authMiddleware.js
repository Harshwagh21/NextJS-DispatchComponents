const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  console.log(`[AUTH] ${req.method} ${req.path}`);
  const authHeader = req.headers['authorization'];
  console.log(`[AUTH] Authorization header:`, authHeader ? 'Present' : 'Missing');
  
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    console.log(`[AUTH] No token provided for ${req.path}`);
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log(`[AUTH] Token verification failed:`, err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log(`[AUTH] Token verified for user:`, user.userId);
    req.user = user; // userId and authority from token
    next();
  });
}

module.exports = authenticateToken;
