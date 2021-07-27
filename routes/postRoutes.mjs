import express from 'express';
import { getProducts, getProductById, deletePost } from '../controllers/postController.mjs';
import { updatePrivilege } from '../middleware/postMiddleware.mjs';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProductById).delete(updatePrivilege, deletePost);

export default router;
