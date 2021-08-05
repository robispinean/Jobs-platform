import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Role from '../models/roleModel.mjs';
import User from '../models/userModel.mjs';

const { SECRET } = process.env;
const ONE_DAY = 24 * 60 * 60;

const validEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const verifyToken = (req, res) => {
  const { accessToken } = req.params;

  if (!accessToken) return res.status(403).json({ error: 'Token must be provided.' });

  return jwt.verify(accessToken, SECRET, (err) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid.' });
    }

    return res.status(200).json({ message: 'Token is valid.' });
  });
};

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).populate('role', '-__v');

  if (!user) {
    res.status(401);
    throw new Error('Email is not recognized.');
  }

  if (user && (await user.isPasswordCorrect(req.body.password))) {
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: (ONE_DAY) });
    res.cookie('jwt', token, { httpOnly: true, maxAge: (ONE_DAY * 1000) });

    res.status(200).json({
      id: user._id,
      email: user.email,
      role: user.role,
      accessToken: token,
    });
  } else {
    res.status(401);
    throw new Error('Password is incorrect.');
  }
});

export const logout = asyncHandler(async (req, res) => {
  console.log('Log out');
  res.cookie('jwt', '', { maxAge: 1 });
  res.json({ message: 'logout' });
});

export const register = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email cannot be empty.');
  }

  if (!password) {
    res.status(400);
    throw new Error('Password cannot be empty.');
  }

  if (!validEmail(email)) {
    res.status(401);
    throw new Error('Email is invalid.');
  }

  const userRole = (await Role.findOne({ name: role }));
  if (!userRole) {
    res.status(401);
    throw new Error('Role is invalid.');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(401);
    throw new Error('Email exists.');
  }

  const user = await User.create({
    email,
    password,
    role: userRole,
  });

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: (ONE_DAY) });
  res.cookie('jwt', token, { httpOnly: true, maxAge: (ONE_DAY * 1000) });

  if (user) {
    res.status(201).json({
      message: 'Account created succesfully.',
      _id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid user data.');
  }
});

const authController = {
  verifyToken,
  login,
  logout,
  register,
};

export default authController;
