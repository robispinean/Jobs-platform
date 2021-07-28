import express from 'express';

import {
  loginController, registerController, verifyTokenController,
} from '../controllers/authController.mjs';

const router = express.Router();

router.route('/login')
  .post(loginController);

router.route('/register')
  .post(registerController);

router.route('/token/:accessToken')
  .post(verifyTokenController);

export default router;
