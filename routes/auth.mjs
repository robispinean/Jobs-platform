import express from 'express';

import { loginController, verifyTokenController } from '../controllers/auth.mjs';

const router = express.Router();

router.post('/login', loginController);

router.post('/token/:accessToken', verifyTokenController);

export default router;
