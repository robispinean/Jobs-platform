import asyncHandler from 'express-async-handler';
import fse from 'fs-extra';
import jwt from 'jsonwebtoken';

import Admin from '../models/adminModel.mjs';
import Company from '../models/companyModel.mjs';
import Role from '../models/roleModel.mjs';
import Student from '../models/studentModel.mjs';
import User from '../models/userModel.mjs';

const appDir = process.cwd();

const { SECRET } = process.env;
const ONE_DAY = 24 * 60 * 60;

const validEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// @desc    Verify if a given jwt token is valid
// @route   Post /api/auth/:accessToken
// @access  Public
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

// @desc    Login to an account
// @route   Post /api/auth/login
// @access  Public
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

// @desc    Logout from current account
// @route   Get /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.json({ message: 'logout' });
});

// @desc    Register an account
// @route   Post /api/auth/register
// @access  Public
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

  const userRole = await Role.findOne({ name: role });
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

  switch (userRole.name) {
    case 'student':
      await Student.create({
        accountRef: user,
        firstName: '',
        lastName: '',
        profilePicture: '/resources/student/default/profile.png',
        resume: '',
        coverLetter: '',
      });
      break;
    case 'company':
      await Company.create({
        accountRef: user,
        companyName: '',
        profilePicture: '/resources/company/default/profile.png',
      });
      break;
    case 'admin':
      await Admin.create({
        accountRef: user,
        nickName: '',
        profilePicture: '/resources/admin/default/profile.png',
      });
      break;
    default:
      break;
  }

  await fse.mkdirs(`${appDir}/public/${userRole.name}/${user._id}/profile`);

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
