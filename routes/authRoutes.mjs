import express from 'express';

import {
  loginController, logoutController, registerController, verifyTokenController,
} from '../controllers/authController.mjs';

const router = express.Router();

router.route('/login')
  .post(loginController);

router.route('/logout')
  .get(logoutController);

router.route('/register')
  .post(registerController);

router.route('/token/:accessToken')
  .post(verifyTokenController);

export default router;
