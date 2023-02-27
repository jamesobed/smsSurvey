import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

import {
  createPost,
  deletePost,
  getAllPost,
  getUserPost,
  getAllUserPost,
  getSinglePost,
} from '../controller/postController';

router.post('/create-post', auth, createPost);
router.get('/get-all-user-post', auth, getAllUserPost);
router.get('/get-all-post', getAllPost);
router.get('/get-single-post/:id', auth, getSinglePost);
router.get('/get-user-post/:id', auth, getUserPost);
router.delete('/delete-post/:id', adminAuth, deletePost);

export default router;
