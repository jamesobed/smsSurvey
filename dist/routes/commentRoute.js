"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const adminAuth_1 = require("../middleware/adminAuth");
const commentController_1 = require("../controller/commentController");
router.post('/create-comment', auth_1.auth || adminAuth_1.adminAuth, commentController_1.createComments);
router.get('/get-all-comments', commentController_1.getAllComments);
exports.default = router;
//# sourceMappingURL=commentRoute.js.map