import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../models/user.mjs';

const { SECRET } = process.env;

export const verifyTokenController = (req, res) => {
  const { accessToken } = req.params;

  if (!accessToken) return res.status(403).json({ error: 'Token must be provided.' });

  return jwt.verify(accessToken, SECRET, (err) => {
    if (err) return res.status(401).json({ error: 'Token is invalid.' });

    return res.status(200).json({ message: 'Token is valid.' });
  });
};

export const loginController = (req, res) => {
  User.findOne({ email: req.body.email }).populate('roles', '-__v')
    .then((user) => {
      if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

      const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

      if (!isPasswordValid) return res.status(401).json({ error: 'Password is invalid.' });

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: 86400 });

      return res.status(200).json({
        id: user._id,
        email: user.email,
        role: user.role,
        accessToken: token,
      });
    }).catch(() => {
      res.status(500).json({ error: 'There was an error on our part.' });
    });
};

// TODO
export const registerController = () => {

};
