import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
        return res.status(401).json({ error: 'Email is not recognizable.' });
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

export const registerController = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email or password cannot be empty.' });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(401).json({ error: 'Email is already used by another account.' });
      }
    })
    .catch(() => {
      res.status(500).json({ error: 'There was an error on our part.' });
    });

  if (!validEmail(email)) {
    res.status(401).json({ error: 'Email is invalid.' });
  }

  const studentUser = new User({
    email,
    password: bcrypt.hashSync(password, 8),
  });

  Role.findOne({ name: role })
    .then((foundRole) => {
      studentUser.role = foundRole._id;

      studentUser.save((err) => {
        if (err) {
          res.status(500).json({ error: 'There was an error on our part.' });
        }

        res.status(200).json({ message: 'Account created succesfully.' });
      });
    })
    .catch(() => {
      res.status(401).json({ error: 'Role is invalid.' });
    });
};
