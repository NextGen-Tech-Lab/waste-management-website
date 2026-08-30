import { verifyToken } from '../../config/jwt.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const normalizedUserId = decoded.userId || decoded.id || decoded.user_id;

    if (!normalizedUserId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = {
      ...decoded,
      userId: normalizedUserId,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No user' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden - Required role(s): ${roles.join(', ')}`
      });
    }

    next();
  };
};
