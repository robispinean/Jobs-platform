import express from 'express';

import {
  getUsers, getUserById, deleteUser, updateUser, getProfilePictureURL, setProfilePicture, getResumeURL, setResume, getCoverLetterURL, setCoverLetter,
} from '../controllers/userController.mjs';

import { updatePrivilege } from '../middleware/userMiddleware.mjs';
import { verifyToken, isStudent } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.route('/')
  .get(verifyToken, getUsers);

router.route('/:id')
  .get(verifyToken, getUserById)
  .delete(verifyToken, updatePrivilege, deleteUser)
  .put(verifyToken, updatePrivilege, updateUser);

router.route('/:id/profile/picture')
  .get(getProfilePictureURL)
  .post(verifyToken, updatePrivilege, setProfilePicture);

router.route('/:id/resume')
  .get(getResumeURL)
  .post(verifyToken, isStudent, setResume);

router.route('/:id/cover-letter')
  .get(getCoverLetterURL)
  .post(verifyToken, isStudent, setCoverLetter);

export default router;
