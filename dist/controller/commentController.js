"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllComments = exports.createComments = void 0;
const googleapis_1 = require("googleapis");
const utils_1 = require("../utils/utils");
const commentHistoryModel_1 = require("../model/commentHistoryModel");
const postModel_1 = require("../model/postModel");
const googleAuth_1 = __importDefault(require("../utils/googleAuth"));
const spreadsheetId = process.env.COMMENT_SHEET;
const client = googleAuth_1.default.getClient();
const createComments = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { commentBody, postID, firstName, lastName } = req.body;
        const validatedInput = await utils_1.createCommentSchema.validate(req.body, utils_1.options);
        if (validatedInput.error) {
            return res.status(400).json(validatedInput.error.details[0].message);
        }
        const post = await postModel_1.PostInstance.findById(postID);
        if (!post) {
            return res.status(404).json({ message: 'post not found' });
        }
        if (post) {
            const comment = await commentHistoryModel_1.CommentHistoryInstance.create({
                userId: userId,
                postID: postID,
                commentBody: commentBody,
                firstName,
                lastName,
            });
            const newPost = await postModel_1.PostInstance.findByIdAndUpdate(postID, {
                $push: { comments: comment },
            }, { new: true });
            const client = await googleAuth_1.default.getClient();
            const googleSheets = googleapis_1.google.sheets({
                version: 'v4',
                auth: client,
            });
            await googleSheets.spreadsheets.values.append({
                auth: googleAuth_1.default,
                spreadsheetId,
                range: 'Created!B:F',
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [[firstName, lastName, postID, userId, commentBody]],
                },
            });
            return res.status(201).json({
                message: 'You have successful commented on post',
                comment,
            });
        }
        else {
            return res.status(400).json({ message: 'Network Error. Comment not successful' });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error,
        });
    }
};
exports.createComments = createComments;
// get all comments
const getAllComments = async (req, res, next) => {
    try {
        const client = await googleAuth_1.default.getClient();
        const googleSheets = googleapis_1.google.sheets({
            version: 'v4',
            auth: client,
        });
        const allComments = await commentHistoryModel_1.CommentHistoryInstance.find();
        if (!allComments) {
            return res.status(404).json({ message: 'No Comments found' });
        }
        //  group comments by postID
        const groupedComments = allComments.reduce((acc, comment) => {
            const { postID } = comment;
            if (!acc[postID]) {
                acc[postID] = [];
            }
            acc[postID].push(comment);
            return acc;
        }, {});
        // const comments = Object.values(groupedComments);
        // console.log(groupedComments);
        // console.log();
        // console.log(comments);
        await googleSheets.spreadsheets.values.append({
            auth: googleAuth_1.default,
            spreadsheetId,
            range: 'Database!B:F',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: allComments.map((comment) => [
                    comment.firstName,
                    comment.lastName,
                    comment.postID,
                    comment.userId,
                    comment.commentBody,
                ]),
            },
        });
        return res.status(200).json({ message: 'Sucessfully fetched all comments' });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error,
        });
    }
};
exports.getAllComments = getAllComments;
//# sourceMappingURL=commentController.js.map