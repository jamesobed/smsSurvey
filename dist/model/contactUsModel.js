"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactUsInstance = exports.ContactUsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ContactUsSchema = new mongoose_1.Schema({
    email: {
        type: String,
        allowNull: false,
    },
    fullName: {
        type: String,
        allowNull: false,
    },
    message: {
        type: String,
        allowNull: false,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});
exports.ContactUsSchema.index({ $email: 'text', $message: 'text' });
exports.ContactUsInstance = (0, mongoose_1.model)('ContactUs', exports.ContactUsSchema);
//# sourceMappingURL=contactUsModel.js.map