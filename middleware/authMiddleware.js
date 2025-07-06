const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret_key'; // Same secret as in your authController

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access Denied. No Token Provided.' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; // Attach user info to request
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = verifyToken;
