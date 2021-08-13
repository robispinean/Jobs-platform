import asyncHandler from 'express-async-handler';
import rimraf from 'rimraf';

import Admin from '../models/adminModel.mjs';
import Company from '../models/companyModel.mjs';
import Student from '../models/studentModel.mjs';
import User from '../models/userModel.mjs';

const appDir = process.cwd();

// @desc    Fetch all users
// @route   GET /api/users
// @access  Private
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User
    .find({}, { __v: 0, password: 0 })
    .populate({
      path: 'role',
      select: '-__v',
    });

  return res.json(users);
});

// @desc    Fetch single user
// @route   GET /api/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id, { __v: 0, password: 0 })
    .populate({
      path: 'role',
      select: '-__v',
    });

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error(`User with id ${id} was not found.`);
  }
});

// @desc    Update an user
// @route   Put /api/users/:id
// @access  Private/Owner/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const user = await User.findById(id, { __v: 0, password: 0 });

  if (user) {
    if (email) {
      user.email = email;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error(`User with id ${id} was not found.`);
  }
});

// @desc    Delete an user
// @route   DELETE /api/users/:id
// @access  Private/Owner/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User
    .findById(id)
    .populate({
      path: 'role',
      select: '-__v',
    });

  if (user) {
    const removedDirPath = `${appDir}/public/${user.role.name}/${user.id}`;

    switch (user.role.name) {
      case 'student':
        await Student.find({ accountRef: id }).deleteOne();
        rimraf(removedDirPath, () => {});
        break;
      case 'company':
        await Company.find({ accountRef: id }).deleteOne();
        rimraf(removedDirPath, () => {});
        break;
      case 'admin':
        await Admin.find({ accountRef: id }).deleteOne();
        rimraf(removedDirPath, () => {});
        break;
      default:
        break;
    }

    await user.remove();

    res.json({ message: `User with id ${id} has been removed.` });
  } else {
    res.status(404);
    throw new Error(`User with id ${id} was not found.`);
  }
});

// @desc    Fetch profile picture URL of user
// @route   GET /api/users/:id/profile/picture
// @access  Public
export const getProfilePictureURL = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let user = await User
    .findById(id)
    .populate({
      path: 'role',
      select: '-__v',
    });

  if (user) {
    switch (user.role.name) {
      case 'student':
        user = await Student.findOne({ accountRef: id });
        break;
      case 'company':
        user = await Company.findOne({ accountRef: id });
        break;
      case 'admin':
        user = await Admin.findOne({ accountRef: id });
        break;
      default:
        break;
    }
  } else {
    res.status(404).json({ error: `User with id ${id} was not found.` });
  }

  res.json({ message: `${user.profilePicture}` });
});

// @desc    Upload image and set it as profile picture of user
// @route   POST /api/users/:id/profile/picture
// @access  Private/Owner/Admin
export const setProfilePicture = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sampleFile } = req.files;

  let user = await User
    .findById(id)
    .populate({
      path: 'role',
      select: '-__v',
    });

  if (user) {
    const uploadedFileName = sampleFile.name;
    const uploadPath = `${appDir}/public/${user.role.name}/${user.id}/profile/${uploadedFileName}`;

    switch (user.role.name) {
      case 'student':
        user = await Student.findOne({ accountRef: id });
        break;
      case 'company':
        user = await Company.findOne({ accountRef: id });
        break;
      case 'admin':
        user = await Admin.findOne({ accountRef: id });
        break;
      default:
        break;
    }

    if (sampleFile.mimetype === 'image/png' || sampleFile === 'image/jpeg' || sampleFile.mimetype === 'image/jpg') {
      sampleFile.mv(uploadPath, async (err) => {
        if (err) {
          res.status(500).json({ error: 'Internal server error.' });
        }

        user.profilePicture = `resources/${user.role.name}/${user.id}/profile/${uploadedFileName}`;

        await user.save();

        res.json({ message: `Profile picture for user ${id} has been changed.` });
      });
    } else {
      res.status(422).json({ error: 'Only images of type png, jpeg or jpg are allowed.' });
    }
  } else {
    res.status(404).json({ error: `User with id ${id} was not found.` });
  }
});

// @desc    Fetch resume URL of user
// @route   GET /api/users/:id/resume
// @access  Public
export const getResumeURL = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let user = await User
    .findById(id)
    .populate({
      path: 'role',
      select: '-__v',
    });

  if (user && user.role.name === 'student') {
    user = await Student.findOne({ accountRef: id });
    res.json({ message: `${user.resume}` });
  } else {
    res.status(404).json({ error: `Student with id ${id} was not found.` });
  }
});

// @desc    Upload and set resume URL of user
// @route   POST /api/users/:id/resume
// @access  Private/Owner/Admin
export const setResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sampleFile } = req.files;

  let user = await User
    .findById(id)
    .populate({
      path: 'role',
      select: '-__v',
    });

  if (user) {
    const uploadedFileName = sampleFile.name;
    const uploadPath = `${appDir}/public/${user.role.name}/${user.id}/${uploadedFileName}`;
    const filePath = `resources/${user.role.name}/${user.id}/${uploadedFileName}`;

    if (user.role.name === 'student') {
      user = await Student.findOne({ accountRef: id });
    }

    if (sampleFile.mimetype === 'application/msword' || sampleFile.mimetype === 'application/pdf') {
      sampleFile.mv(uploadPath, async (err) => {
        if (err) {
          res.status(500).json({ error: 'Internal server error.' });
        }

        user.resume = filePath;

        await user.save();

        res.json({ message: `Resume for user ${id} has been added.` });
      });
    } else {
      res.status(422).json({ error: 'Only documents of type doc or pdf are allowed.' });
    }
  } else {
    res.status(404).json({ error: `User with id ${id} was not found.` });
  }
});

// @desc    Fetch cover letter URL of user
// @route   GET /api/users/:id/cover-letter
// @access  Public
export const getCoverLetterURL = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let user = await User
    .findById(id)
    .populate({
      path: 'role',
      select: '-__v',
    });

  if (user && user.role.name === 'student') {
    user = await Student.findOne({ accountRef: id });
    res.json({ message: `${user.coverLetter}` });
  } else {
    res.status(404).json({ error: `Student with id ${id} was not found.` });
  }
});

// @desc    Upload and set cover letter URL of user
// @route   POST /api/users/:id/cover-letter
// @access  Private/Owner/Admin
export const setCoverLetter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sampleFile } = req.files;

  let user = await User
    .findById(id)
    .populate({
      path: 'role',
      select: '-__v',
    });

  if (user) {
    const uploadedFileName = sampleFile.name;
    const uploadPath = `${appDir}/public/${user.role.name}/${user.id}/${uploadedFileName}`;
    const filePath = `resources/${user.role.name}/${user.id}/${uploadedFileName}`;

    if (user.role.name === 'student') {
      user = await Student.findOne({ accountRef: id });
    }

    if (sampleFile.mimetype === 'application/msword' || sampleFile.mimetype === 'application/pdf') {
      sampleFile.mv(uploadPath, async (err) => {
        if (err) {
          res.status(500).json({ error: 'Internal server error.' });
        }

        user.coverLetter = filePath;

        await user.save();

        res.json({ message: `Cover letter for user ${id} has been added.` });
      });
    } else {
      res.status(422).json({ error: 'Only documents of type doc or pdf are allowed.' });
    }
  } else {
    res.status(404).json({ error: `User with id ${id} was not found.` });
  }
});

const userController = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfilePictureURL,
  setProfilePicture,
  getResumeURL,
  setResume,
  getCoverLetterURL,
  setCoverLetter,
};

export default userController;
