import createError from 'http-errors';
import express from 'express';

import errorController from '../controllers/404.mjs';

const router = express.Router();

router.use(((req, res, next) => {
  next(createError(404));
}));

router.use(errorController);

export default router;
