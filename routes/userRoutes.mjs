import express from 'express';
import {
    getUsers, getUserById, deleteUser, updateUser,
} from '../controllers/userController.mjs';
import { updatePrivilege } from '../middleware/userMiddleware.mjs';
import { verifyToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.route('/')
    .get(verifyToken, getUsers);

router.route('/:id')
    .get(verifyToken, getUserById)
    .delete(verifyToken, updatePrivilege, deleteUser)
    .put(verifyToken, updatePrivilege, updateUser);

export default router;