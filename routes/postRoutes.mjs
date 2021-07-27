import express from 'express';
import { getProducts, getProductById, deletePost, createPost } from '../controllers/postController.mjs';
import { updatePrivilege } from '../middleware/postMiddleware.mjs';
import { verifyToken } from '../middleware/auth.mjs';

const router = express.Router();

router.route('/').get(getProducts).post(verifyToken, createPost);
router.route('/:id').get(getProductById).delete(updatePrivilege, deletePost);

export default router;
