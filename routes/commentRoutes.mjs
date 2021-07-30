import express from 'express';
import {
  createComment, getComments, deleteComment, updateComment,
} from '../controllers/commentController.mjs';
import { updatePrivilege } from '../middleware/commentMiddleware.mjs';
import { verifyToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.route('/:id/comments')
  .post(verifyToken, createComment)
  .get(getComments);

router.route('/comments/:commentId')
  .delete(verifyToken, updatePrivilege, deleteComment)
  .put(verifyToken, updatePrivilege, updateComment);

export default router;
