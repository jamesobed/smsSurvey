"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const adminAuth_1 = require("../middleware/adminAuth");
const postController_1 = require("../controller/postController");
router.post('/create-post', auth_1.auth, postController_1.createPost);
router.get('/get-all-user-post', auth_1.auth, postController_1.getAllUserPost);
router.get('/get-all-post', postController_1.getAllPost);
router.get('/get-single-post/:id', auth_1.auth, postController_1.getSinglePost);
router.get('/get-user-post/:id', auth_1.auth, postController_1.getUserPost);
router.delete('/delete-post/:id', adminAuth_1.adminAuth, postController_1.deletePost);
exports.default = router;
//# sourceMappingURL=postRoute.js.map