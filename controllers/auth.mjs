import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'
import Role from '../models/role.mjs';
import User from '../models/user.mjs';

const { SECRET } = process.env;

const validEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const verifyTokenController = (req, res) => {
  const { accessToken } = req.params;

  if (!accessToken) return res.status(403).json({ error: 'Token must be provided.' });

  return jwt.verify(accessToken, SECRET, (err) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid.' });
    }

    return res.status(200).json({ message: 'Token is valid.' });
  });
};

export const loginController = (req, res) => {
  User.findOne({ email: req.body.email }).populate('role', '-__v')
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Email is not recognized.' });
      }

      const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ error: 'Password is incorrect.' });
      }

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: 86400 });

      return res.status(200).json({
        id: user._id,
        email: user.email,
        role: user.role.name,
        accessToken: token,
      });
    }).catch(() => {
      res.status(500).json({ error: 'There was an error on our part.' });
    });
};

export const registerController = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email) {
    res.status(400)
    throw new Error('Email cannot be empty.')
  }

  if (!password) {
    res.status(400)
    throw new Error('Password cannot be empty.')
  }

  if (!validEmail(email)) {
    res.status(401)
    throw new Error('Email is invalid.')
  }

  const userRole = (await Role.findOne({ name: role }))
  if (!userRole) {
    res.status(401)
    throw new Error('Role is invalid.')
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(401)
    throw new Error("Email exists")
  }

  const user = await User.create({
    email: email,
    password: password,
    role: userRole,
  })

  if (user) {
    res.status(201).json({
      message: 'Account created succesfully.',
      _id: user._id,
      email: user.email,
      role: user.role,
      token: jwt.sign({ id: user.id }, SECRET, { expiresIn: 86400 })
    });
  } else {
    res.status(401)
    throw new Error('Invalid user data.')
  }

});
