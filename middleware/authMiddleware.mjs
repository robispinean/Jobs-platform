import jwt from 'jsonwebtoken';
import User from '../models/userModel.mjs';

const { SECRET } = process.env;

export const verifyToken = async (req, res, next) => {
  let accessToken = -1;

  if (req.headers.authorization) {
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
      try {
        [, accessToken] = authorization.split(' ');

        const decoded = jwt.verify(accessToken, SECRET);

        req.user = await User.findById(decoded.id).select('-password');
        if (req.user) {
          return next();
        }

        res.status(401).json({ error: 'Try logging in again.' });
      } catch (err) {
        return res.status(500).json({ error: 'Internal error.' });
      }
    }
  }

  return res.status(403).json({ error: 'You must be logged in to access this resource.' });
};

const authMiddleware = {
  verifyToken,
};

export default authMiddleware;
