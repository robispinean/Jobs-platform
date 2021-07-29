import express from 'express';
import {
  createComment, getComments, deleteComment,
} from '../controllers/commentController.mjs';
import { updatePrivilege } from '../middleware/postMiddleware.mjs';
import { verifyToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.route('/:id/comments')
  .post(verifyToken, createComment)
  .get(getComments);

router.route('/:id/comments/:commentId')
  .delete(verifyToken, updatePrivilege, deleteComment);

export default router;