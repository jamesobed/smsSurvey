"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentHistoryInstance = exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.commentSchema = new mongoose_1.Schema({
    commentBody: {
        type: String,
        allowNull: false,
    },
    userId: {
        type: String,
        allowNull: false,
    },
    postID: {
        type: String,
        defaultValue: false,
    },
    firstName: {
        type: String,
        allowNull: false,
    },
    lastName: {
        type: String,
        allowNull: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.commentSchema.index({ $commentBody: 'text', $firstName: 'text' });
exports.CommentHistoryInstance = (0, mongoose_1.model)('comments', exports.commentSchema);
//# sourceMappingURL=commentHistoryModel.js.map