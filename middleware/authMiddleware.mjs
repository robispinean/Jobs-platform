import jwt from 'jsonwebtoken';
import User from '../models/userModel.mjs';
import Role from '../models/roleModel.mjs';

const { SECRET } = process.env;

const checkRole = async (id, roleName) => {
  let flag = false;

  if (id) {
    const user = await User.findById(id);
    const role = await Role.findOne({ _id: { $in: user.role } });

    if (role.name && role.name === roleName) {
      flag = true;
    }
  }

  return flag;
};

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
      } catch (err) {
        return res.status(500).json({ error: 'Internal error.' });
      }
    }
  }

  return res.status(403).json({ error: 'You must be logged in to access this resource.' });
};

export const isStudent = async (req, res, next) => {
  if (req.body.id) {
    const { id } = req.body;

    if (checkRole(id, 'student')) {
      return next();
    }
  }

  return res.status(403).json({ error: 'You must be logged in with a student account to access this resource.' });
};

export const isCompany = async (req, res, next) => {
  if (req.body.id) {
    const { id } = req.body;

    if (checkRole(id, 'company')) {
      return next();
    }
  }

  return res.status(403).json({ error: 'You must be logged in with a company account to access this resource.' });
};

export const isAdmin = async (req, res, next) => {
  if (req.body.id) {
    const { id } = req.body;

    if (checkRole(id, 'admin')) {
      return next();
    }
  }

  return res.status(403).json({ error: 'You must be logged in with an admin account to access this resource.' });
};

const authMiddleware = {
  verifyToken,
  isStudent,
  isCompany,
  isAdmin,
};

export default authMiddleware;
