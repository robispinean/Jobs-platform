import jwt from 'jsonwebtoken';

const { SECRET } = process.env;

export const verifyToken = (req, res, next) => {
  const accessToken = req.headers['x-access-token'];

  if (!accessToken) return res.status(403).json({ error: 'You must be logged in to access this resource.' });

  return jwt.verify(accessToken, SECRET, (err) => {
    if (err) {
      return res.status(401).json({ error: 'Provided token is invalid.' });
    }

    return next();
  });
};

const authMiddleware = {
  verifyToken,
};

export default authMiddleware;
