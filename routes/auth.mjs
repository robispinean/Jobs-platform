import express from 'express';

import { loginController, registerController, verifyTokenController } from '../controllers/auth.mjs';

const router = express.Router();

router.post('/login', loginController);

router.post('/register', registerController);

router.post('/token/:accessToken', verifyTokenController);

export default router;
