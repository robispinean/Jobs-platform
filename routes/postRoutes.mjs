import express from 'express';
import { getProducts, getProductById, deletePost, createPost, updatePost, createComment } from '../controllers/postController.mjs';
import { updatePrivilege } from '../middleware/postMiddleware.mjs';
import { verifyToken } from '../middleware/auth.mjs';

const router = express.Router();

router.route('/').get(getProducts).post(verifyToken, createPost);
router.route('/:id').get(getProductById).delete(verifyToken, updatePrivilege, deletePost).put(verifyToken, updatePrivilege, updatePost);
router.route('/:id/comments').post(verifyToken, createComment)

export default router;
