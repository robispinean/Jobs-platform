import express from 'express';
import {
  createComment,
} from '../controllers/commentController.mjs';
import { updatePrivilege } from '../middleware/postMiddleware.mjs';
import { verifyToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.route('/:id/comments')
  .post(verifyToken, createComment);

export default router;