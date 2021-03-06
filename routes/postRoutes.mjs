import express from 'express';

import {
  getPosts, getPostById, deletePost, createPost, updatePost,
} from '../controllers/postController.mjs';

import { updatePrivilege } from '../middleware/postMiddleware.mjs';
import { verifyToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(verifyToken, createPost);

router.route('/:id')
  .get(getPostById)
  .delete(verifyToken, updatePrivilege, deletePost)
  .put(verifyToken, updatePrivilege, updatePost);

export default router;
