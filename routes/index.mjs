import express from 'express';

import indexController from '../controllers/index.mjs';

const router = express.Router();

router.get('/', indexController);

export default router;
