import jwt from 'jsonwebtoken';
import User from '../models/user.mjs'

const { SECRET } = process.env;

export const verifyToken = async (req, res, next) => {
  let accessToken

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      accessToken = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(accessToken, SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      return next();
    } catch (err) {
      res.status(500).json({ error: 'Internal error.' })
    }
  }
  else {
    res.status(403).json({ error: 'You must be logged in to access this resource.' });
  }
};

const authMiddleware = {
  verifyToken,
};

export default authMiddleware;
