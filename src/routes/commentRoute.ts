import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

import { createComments, getAllComments } from '../controller/commentController';

router.post('/create-comment', auth || adminAuth, createComments);
router.get('/get-all-comments', getAllComments);

export default router;
