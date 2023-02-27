"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const auth_1 = require("../middleware/auth");
const surveyController_1 = require("../controller/surveyController");
const adminAuth_1 = require("../middleware/adminAuth");
const updateAvatar_1 = __importDefault(require("../controller/FILE/email/updateAvatar"));
const router = express_1.default.Router();
router.post('/register', userController_1.registerUser);
router.get('/verify/:token', userController_1.verifyUser);
router.post('/login', userController_1.userLogin);
router.post('/forgot-password', userController_1.forgetPassword);
router.patch('/update', auth_1.auth, userController_1.updateUser);
router.put('/update-admin/', adminAuth_1.adminAuth, userController_1.updateUser);
router.patch('/reset-password', userController_1.resetPassword);
router.patch('/resend-verification', userController_1.resendVerificationLink);
router.get('/user-post/:id', auth_1.auth, userController_1.getUserPost);
router.get('/all-comment-on-post/:id', auth_1.auth, userController_1.allCommentOnPost);
router.get('/single-user', auth_1.auth, userController_1.singleUser);
router.get('/all-users', adminAuth_1.adminAuth, userController_1.allUsers);
router.delete('/delete-user/:id', adminAuth_1.adminAuth, userController_1.deleteUser);
router.patch('/upload-image', auth_1.auth, userController_1.uploadImage);
router.get('/logout', userController_1.userLogout);
router.post('/create-survey', auth_1.auth, surveyController_1.createSurvey);
router.get('/all-surveys', surveyController_1.getAllSurveys);
// router.post('/upload', upload.single('image'), uploadImg);
router.post('/upload', async (req, res) => {
    console.log('imagee');
    const imagee = await (0, updateAvatar_1.default)(req.body.image);
    console.log(imagee);
    return res.status(200).json({ msg: 'success' });
});
exports.default = router;
//# sourceMappingURL=users.js.map