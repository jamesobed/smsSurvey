"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suscribeSchema = exports.ImgSch = exports.contactUsSchema = exports.CreateSurveySchema = exports.generateOtp = exports.createCommentSchema = exports.createPostSchema = exports.generateToken = exports.options = exports.resetPasswordSchema = exports.fogotPasswordSchema = exports.loginSchema = exports.updateUserSchema = exports.signUpSchema = exports.sendEmail = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.sendEmail = joi_1.default.object().keys({
    from: joi_1.default.string(),
    to: joi_1.default.string().required(),
    subject: joi_1.default.string().required(),
    text: joi_1.default.string(),
    html: joi_1.default.string().required(),
});
exports.signUpSchema = joi_1.default.object()
    .keys({
    name: joi_1.default.string().required(),
    occupation: joi_1.default.string().required(),
    dateOfBirth: joi_1.default.string().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    phoneNumber: joi_1.default.string(),
    avatar: joi_1.default.string(),
    role: joi_1.default.string(),
    isVerified: joi_1.default.boolean(),
    password: joi_1.default.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    confirmPassword: joi_1.default.any()
        .equal(joi_1.default.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
})
    .with('password', 'confirmPassword');
exports.updateUserSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    occupation: joi_1.default.string(),
    phoneNumber: joi_1.default.string(),
    avatar: joi_1.default.string(),
    dateOfBirth: joi_1.default.string(),
    role: joi_1.default.string(),
});
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
});
exports.fogotPasswordSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
});
exports.resetPasswordSchema = joi_1.default.object()
    .keys({
    token: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirmPassword: joi_1.default.any()
        .equal(joi_1.default.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
})
    .with('password', 'confirmPassword');
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: '',
        },
    },
};
const generateToken = (user) => {
    const pass = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_DURATION;
    return jsonwebtoken_1.default.sign(user, pass, { expiresIn });
};
exports.generateToken = generateToken;
exports.createPostSchema = joi_1.default.object().keys({
    postTitle: joi_1.default.string().trim().required(),
    postBody: joi_1.default.string().trim().required(),
    userSummary: joi_1.default.string().required(),
    category: joi_1.default.string().required(),
    author: joi_1.default.string().required(),
    postImage: joi_1.default.string().trim().required(),
});
exports.createCommentSchema = joi_1.default.object().keys({
    commentBody: joi_1.default.string().required(),
    postID: joi_1.default.string().trim().required(),
    firstName: joi_1.default.string().trim().required(),
    lastName: joi_1.default.string().trim().required(),
});
exports.generateOtp = joi_1.default.object().keys({
    purpose: joi_1.default.string().required(),
});
exports.CreateSurveySchema = joi_1.default.object().keys({
    medicalWorker: joi_1.default.boolean().required(),
    usedEMR: joi_1.default.boolean().required(),
    experienceWithEMR: joi_1.default.string().required(),
    nonHealthCareExperienceWithEMR: joi_1.default.string().required(),
    expectedWebsiteContent: joi_1.default.string().required(),
    interestedWebsiteContent: joi_1.default.string().required(),
    countryEMRWasUsed: joi_1.default.string().required(),
    yearEMRWasUsed: joi_1.default.string().required(),
    EMRDislikeAndImprovement: joi_1.default.string().required(),
    newEMRFunctionalities: joi_1.default.string().required(),
    userSummaryNigeriaEMR: joi_1.default.string().required(),
    userEmail: joi_1.default.string().required(),
});
// contact us schema with full name, email, message
exports.contactUsSchema = joi_1.default.object().keys({
    fullName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    message: joi_1.default.string().required(),
});
// contact us schema with full name, email, message
exports.ImgSch = joi_1.default.object().keys({
    avatar: joi_1.default.string().required(),
});
exports.suscribeSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
});
//# sourceMappingURL=utils.js.map