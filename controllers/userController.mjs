import asyncHandler from 'express-async-handler';
import User from '../models/userModel.mjs';

// @desc    Fetch all users
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
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
const getUserById = asyncHandler(async (req, res) => {
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

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Owner/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    const userId = user._id;
    await user.remove();

    res.json({ message: `User ${userId} removed.` });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

// @desc    Update a user
// @route   Put /api/users/:id
// @access  Private/Owner/Admin
const updateUser = asyncHandler(async (req, res) => {
  const {
    email,
  } = req.body;

  const user = await User.findById(req.params.id, { __v: 0, password: 0 })
    .populate({
      path: 'role',
      select: '-__v',
    });

  if (user) {
    user.email = email;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

export {
  getUsers, getUserById, deleteUser, updateUser,
};
