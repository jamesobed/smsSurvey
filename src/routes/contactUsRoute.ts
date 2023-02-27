import express from 'express';
const router = express.Router();

import { contactUs } from '../controller/userController';

router.post('/create-contact', contactUs);

export default router;
