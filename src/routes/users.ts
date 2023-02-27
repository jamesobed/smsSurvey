import express, { Request, Response, NextFunction } from 'express';
import {
  registerUser,
  updateUser,
  forgetPassword,
  resetPassword,
  userLogin,
  verifyUser,
  singleUser,
  allUsers,
  resendVerificationLink,
  getUserPost,
  allCommentOnPost,
  deleteUser,
  uploadImage,
  userLogout,
} from '../controller/userController';
import { auth } from '../middleware/auth';
import { createSurvey, getAllSurveys } from '../controller/surveyController';
import { adminAuth } from '../middleware/adminAuth';
import uploadImg from '../controller/FILE/email/updateAvatar';

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify/:token', verifyUser);
router.post('/login', userLogin);
router.post('/forgot-password', forgetPassword);
router.patch('/update', auth, updateUser);
router.put('/update-admin/', adminAuth, updateUser);
router.patch('/reset-password', resetPassword);
router.patch('/resend-verification', resendVerificationLink);
router.get('/user-post/:id', auth, getUserPost);
router.get('/all-comment-on-post/:id', auth, allCommentOnPost);
router.get('/single-user', auth, singleUser);
router.get('/all-users',adminAuth, allUsers);
router.delete('/delete-user/:id', adminAuth, deleteUser);
router.patch('/upload-image', auth, uploadImage);
router.get('/logout', userLogout);
router.post('/create-survey', auth, createSurvey);
router.get('/all-surveys', getAllSurveys);
// router.post('/upload', upload.single('image'), uploadImg);
router.post('/upload', async (req, res) => {
  console.log('imagee');
  const imagee = await uploadImg(req.body.image);
  console.log(imagee);
  return res.status(200).json({ msg: 'success' });
});

export default router;
