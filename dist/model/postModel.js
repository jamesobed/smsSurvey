"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostInstance = exports.PostSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PostSchema = new mongoose_1.Schema({
    postTitle: {
        type: String,
        allowNull: false,
    },
    postBody: {
        type: String,
        allowNull: false,
    },
    postImage: {
        type: String,
        allowNull: false,
    },
    userSummary: {
        type: String,
        allowNull: false,
    },
    userId: {
        type: String,
        allowNull: false,
    },
    category: {
        type: String,
        enum: [
            'health care',
            'software trends',
            'public health',
            'research methodology',
            'research outcomes',
            'research findings',
            'electronic medical records',
            'healthcare interventions',
        ],
        allowNull: false,
    },
    author: {
        type: String,
        allowNull: false,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'comments' }],
});
exports.PostSchema.index({ $postTitle: 'text', $userSummary: 'text' });
exports.PostInstance = (0, mongoose_1.model)('posts', exports.PostSchema);
//# sourceMappingURL=postModel.js.map