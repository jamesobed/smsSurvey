"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSinglePost = exports.getUserPost = exports.deletePost = exports.getAllPost = exports.getAllUserPost = exports.createPost = void 0;
const utils_1 = require("../utils/utils");
const sendMails_1 = __importDefault(require("./FILE/email/sendMails"));
const userModel_1 = require("../model/userModel");
const sample_1 = __importDefault(require("./FILE/medicalImages/sample"));
const postModel_1 = require("../model/postModel");
const FILESTACK_KEY = process.env.FILESTACK_KEY;
async function createPost(req, res, next) {
    try {
        const userID = req.user.id;
        const ValidatePost = await utils_1.createPostSchema.validateAsync(req.body, utils_1.options);
        if (ValidatePost.error) {
            return res.status(400).json({
                status: 'error',
                message: ValidatePost.error.details[0].message,
            });
        }
        const user = await userModel_1.userInstance.findById(userID);
        let postImg;
        let optionImg = sample_1.default[Math.floor(Math.random() * sample_1.default.length)];
        const record = await postModel_1.PostInstance.create({
            postTitle: req.body.postTitle,
            postBody: req.body.postBody,
            category: req.body.category.toLowerCase().trim(),
            postImage: req.body.postImage,
            userSummary: req.body.userSummary,
            userId: userID,
            author: req.body.author,
        });
        if (record) {
            const allUsers = await userModel_1.userInstance.find({ isVerified: true, notify: true });
            const emails = allUsers.map((user) => user.email);
            const message = `A new post has been created by ${user.occupation}. ${user.name} with the title: <b>${req.body.postTitle}</b>`;
            sendMails_1.default.postNotification(emails, message);
            return res.status(201).json({
                status: 'success',
                message: 'Post created successfully',
                data: record,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}
exports.createPost = createPost;
async function getAllUserPost(req, res, next) {
    try {
        const userId = req.user.id;
        const allPost = await postModel_1.PostInstance.findById({
            userId,
        }).populate('comments');
        if (allPost) {
            return res.status(200).json({
                status: 'success',
                message: 'all post retrieved successfully',
                data: allPost,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'internal server error',
        });
    }
}
exports.getAllUserPost = getAllUserPost;
async function getAllPost(req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const allPost = await postModel_1.PostInstance.find({}).sort({ date: -1 }).skip(startIndex).limit(limit).populate('comments').exec();
        if (allPost) {
            // get all post, comments and post author
            return res.status(200).json({
                status: 'success',
                message: 'all post retrieved successfully',
                data: allPost,
                currentPage: page,
                hasPreviousPage: startIndex > 0,
                hasNextPage: endIndex < await postModel_1.PostInstance.countDocuments().exec(),
                previousPage: page - 1,
                nextPage: page + 1,
                limit
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'internal server error',
        });
    }
}
exports.getAllPost = getAllPost;
async function deletePost(req, res, next) {
    try {
        const id = req.params.id;
        const post = await postModel_1.PostInstance.findByIdAndDelete(id);
        if (post) {
            return res.status(200).json({
                status: 'success',
                message: 'Post deleted successfully',
            });
        }
        return res.status(404).json({
            status: 'error',
            message: 'Post not found',
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'internal server error',
        });
    }
}
exports.deletePost = deletePost;
async function getUserPost(req, res, next) {
    try {
        const userID = req.user.id;
        const post = await postModel_1.PostInstance.find({
            where: { userId: userID },
        });
        if (post) {
            return res.status(200).json({
                status: 'success',
                message: 'Post retrieved successfully',
                data: post,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'internal server error',
        });
    }
}
exports.getUserPost = getUserPost;
async function getSinglePost(req, res, next) {
    try {
        const id = req.params.id;
        const post = await postModel_1.PostInstance.findById(id).populate('comments').sort({ createdAt: -1 }).exec();
        if (post) {
            return res.status(200).json({
                status: 'success',
                message: 'Post retrieved successfully',
                data: post,
            });
        }
        return res.status(404).json({
            status: 'error',
            message: 'Post not found',
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'internal server error',
        });
    }
}
exports.getSinglePost = getSinglePost;
// export async function updatePost(req: Request, res: Response, next: NextFunction) {
//   try {
//     const {id} = req.params.id;
//     const post = await PostInstance.findByIdAndUpdate {
//       id,
//       req.body,
//     };
//     if (post) {
//       return res.status(200).json({
//         status: 'success',
//         message: 'Post updated successfully',
//         data: post,
//       });
//     }
//     return res.status(404).json({
//       status: 'error',
//       message: 'Post not found',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 'error',
//       message: 'internal server error',
//     });
//   }
// }
//# sourceMappingURL=postController.js.map