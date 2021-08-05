import asyncHandler from 'express-async-handler';
import rimraf from 'rimraf';

import Admin from '../models/adminModel.mjs';
import Company from '../models/companyModel.mjs';
import Student from '../models/studentModel.mjs';
import User from '../models/userModel.mjs';

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
  const user = await User.findById(req.params.id, { __v: 0, password: 0 })
    .populate({
      path: 'role',
      select: '-__v',
    });

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found.');
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
    throw new Error('User not found.');
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
    const removedDirPath = `{appDir}/public/resources/${user.role.name}/${user.id}`;

    switch (user.role.name) {
      case 'student':
        await Student.find({ accountRef: id }).remove();
        rimraf(removedDirPath, () => {});
        break;
      case 'company':
        await Company.find({ accountRef: id }).remove();
        rimraf(removedDirPath, () => {});
        break;
      case 'admin':
        await Admin.find({ accountRef: id }).remove();
        rimraf(removedDirPath, () => {});
        break;
      default:
        break;
    }

    await user.remove();

    res.json({ message: `User ${id} removed.` });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

// @desc    Upload and set current profile picture of an user
// @route   POST /api/users/:id/profile/picture
// @access  Private/Owner/Admin
export const setProfilePicture = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sampleFile } = req.files;

  const user = await User
    .findById(id)
    .populate({
      path: 'role',
      select: '-__v',
    });

  if (user) {
    const uploadedFileName = sampleFile.name;
    const uploadPath = `/resources/${user.role.name}/${user.id}/profile/${uploadedFileName}`;
    let workingUser;

    sampleFile.mv(uploadPath, async () => {
      switch (user.role.name) {
        case 'student':
          workingUser = await Student.findOne({ accountRef: id });
          break;
        case 'company':
          workingUser = await Company.findOne({ accountRef: id });
          break;
        case 'admin':
          workingUser = await Admin.findOne({ accountRef: id });
          break;
        default:
          break;
      }

      workingUser.profilePicture = uploadPath;

      await workingUser.save();

      res.json({ message: `Profile picture for user ${id} has been changed.` });
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

const userController = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  setProfilePicture,
};

export default userController;
