import jwt from 'jwt-simple';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';

export const generateToken = (payload) => {
  const expiresIn = Math.floor(Date.now() / 1000) + 604800; // 7 days in seconds
  return jwt.encode({ ...payload, exp: expiresIn }, JWT_SECRET);
};

export const verifyToken = (token) => {
  try {
    return jwt.decode(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token, JWT_SECRET, true);
  } catch (error) {
    return null;
  }
};
