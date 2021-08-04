import express from 'express';
import {
    getUsers, getUserById, deleteUser, updateUser,
} from '../controllers/userController.mjs';
import { verifyToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.route('/')
    .get(verifyToken, getUsers);

router.route('/:id')
    .get(verifyToken, getUserById)
    .delete(verifyToken, deleteUser)
    .put(verifyToken, updateUser);

export default router;