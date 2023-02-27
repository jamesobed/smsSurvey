"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInstance = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'full name is required'],
        trim: true,
    },
    occupation: {
        type: String,
        required: [true, 'Please provide occupation'],
        trim: true,
    },
    dateOfBirth: {
        type: String,
        required: [true, 'Please provide date of birth'],
        trim: true,
    },
    email: {
        type: String,
        trim: false,
        required: [true, 'Please provide a valid email'],
        unique: true,
    },
    phoneNumber: {
        type: String,
        default: '09000000000',
    },
    password: {
        type: String,
        required: [true, 'enter a password'],
        trim: true,
        min: 5,
        max: 200,
    },
    avatar: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7nG8OgXmMOXXiwbNOc-PPXUcilcIhCkS9BQ&usqp=CAU',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        default: 'user',
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    gender: {
        type: String,
        default: '',
    },
    notify: {
        type: Boolean,
        default: true,
    },
    filledSurveyForm: {
        type: Boolean,
        default: false,
    },
    cloudinary_id: {
        type: String,
        default: '',
    },
    surveyDate: {
        type: String,
        default: '',
    },
});
exports.UserSchema.index({ request: 'text' });
exports.userInstance = (0, mongoose_1.model)('User', exports.UserSchema);
//# sourceMappingURL=userModel.js.map