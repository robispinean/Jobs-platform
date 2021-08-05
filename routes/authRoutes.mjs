import express from 'express';

import {
  login, logout, register, verifyToken,
} from '../controllers/authController.mjs';

const router = express.Router();

router.route('/login')
  .post(login);

router.route('/logout')
  .get(logout);

router.route('/register')
  .post(register);

router.route('/token/:accessToken')
  .post(verifyToken);

export default router;
