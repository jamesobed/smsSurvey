"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.contactUs = exports.allCommentOnPost = exports.getUserPost = exports.deleteUser = exports.allUsers = exports.singleUser = exports.userLogout = exports.resetPassword = exports.forgetPassword = exports.userLogin = exports.updateUser = exports.resendVerificationLink = exports.verifyUser = exports.registerUser = void 0;
const uuid_1 = require("uuid");
const node_fetch_1 = __importDefault(require("node-fetch"));
const utils_1 = require("../utils/utils");
const userModel_1 = require("../model/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendMails_1 = __importDefault(require("./FILE/email/sendMails"));
const postModel_1 = require("../model/postModel");
const contactUsModel_1 = require("../model/contactUsModel");
const FILESTACK_KEY = process.env.FILESTACK_KEY;
const backendURL = "https://isdservices.herokuapp.com";
async function registerUser(req, res, next) {
    try {
        const validationResult = utils_1.signUpSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const duplicateEmail = await userModel_1.userInstance.findOne({ email: req.body.email });
        if (duplicateEmail) {
            return res.status(409).json({
                message: 'Email is used, please change email',
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 10), token = (0, uuid_1.v4)(), link = `https://isdservices.herokuapp.com/user/verify/${token}`, role = req.body.email.endsWith('@isdservices.org') ? 'admin' : 'user';
        const record = await userModel_1.userInstance.create({
            name: req.body.name,
            occupation: req.body.occupation,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: passwordHash,
            avatar: req.body.avatar,
            isVerified: req.body.isVerified || false,
            token,
            role,
        });
        sendMails_1.default.verifyUserEmail(record.email, token);
        return res.status(201).json({
            message: 'Successfully created a user',
            record: {
                id: record.id,
                name: record.name,
                phoneNumber: record.phoneNumber,
                email: record.email,
                avatar: record.avatar,
                isVerified: record.isVerified,
                token: record.token,
            },
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'failed to register',
            route: '/register',
        });
    }
}
exports.registerUser = registerUser;
async function verifyUser(req, res, next) {
    try {
        const { token } = req.params;
        const user = await userModel_1.userInstance.findOne({ token });
        if (!user) {
            return res
                .status(404)
                .json({
                message: 'User not found',
            })
                .redirect(`${process.env.FRONTEND_URL}/${token}`);
        }
        if (user) {
            user.isVerified = true;
            user.token = 'null';
            await user.save();
            const id = user.id;
            return res.status(200).redirect(`${process.env.FRONTEND_URL}/login`);
        }
    }
    catch (err) {
        return res.status(500).json({
            message: 'failed to verify user',
            route: '/verify/:id',
        });
    }
}
exports.verifyUser = verifyUser;
async function resendVerificationLink(req, res, next) {
    try {
        const validationResult = utils_1.fogotPasswordSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const { email } = req.body;
        const user = await userModel_1.userInstance.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        if (user.isVerified) {
            return res.status(409).json({
                message: 'Email already verified',
            });
        }
        if (user) {
            const token = (0, uuid_1.v4)();
            user.token = token ? token : user.token;
            await user.save();
            const email_response = await sendMails_1.default
                .resendVerificationLink(user.email, token)
                .then((email_response) => {
                return res.status(200).json({
                    message: 'Verification link sent successfully',
                    // token,
                });
            })
                .catch((err) => {
                res.status(500).json({
                    message: 'Server error',
                    err,
                });
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            message: 'failed to resend verification link',
            route: '/resend-verification-link',
        });
    }
}
exports.resendVerificationLink = resendVerificationLink;
async function updateUser(req, res, next) {
    try {
        console.log(req.body);
        const id = req.user.id;
        const record = await userModel_1.userInstance.findById(id);
        const { name, avatar, occupation, dateOfBirth, phoneNumber, notify } = req.body;
        const validationResult = utils_1.updateUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        if (!record) {
            return res.status(404).json({
                message: 'cannot find user',
            });
        }
        record.name = name ? name : record.name;
        record.occupation = occupation ? occupation : record.occupation;
        record.dateOfBirth = dateOfBirth ? dateOfBirth : record.dateOfBirth;
        record.phoneNumber = phoneNumber ? phoneNumber : record.phoneNumber;
        record.avatar = avatar ? avatar : record.avatar;
        record.notify = notify ? notify : record.notify;
        record.role = req.body.role || 'user';
        await record.save();
        return res.status(202).json({
            message: 'successfully updated user details',
            update: record,
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'failed to update user details, check image format', err });
    }
}
exports.updateUser = updateUser;
async function userLogin(req, res, next) {
    try {
        const { email, password } = req.body;
        const validate = utils_1.loginSchema.validate(req.body, utils_1.options);
        if (validate.error) {
            return res.status(401).json({ Error: validate.error.details[0].message });
        }
        let validUser = (await userModel_1.userInstance.findOne({ email: email.trim('').toLowerCase() }));
        if (!validUser) {
            return res.status(401).json({ message: 'User is not registered' });
        }
        const { id } = validUser;
        const token = (0, utils_1.generateToken)({ id });
        const validatedUser = await bcryptjs_1.default.compare(password, validUser.password);
        if (!validatedUser) {
            return res.status(401).json({ message: 'failed to login, wrong user email/password inputed' });
        }
        if (validUser.isVerified && validatedUser) {
            return res
                .cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            })
                .status(200)
                .json({
                message: 'Successfully logged in',
                id,
                token,
                user_info: {
                    name: `${validUser.name} `,
                    occupation: `${validUser.occupation}`,
                    email: `${validUser.email}`,
                    avatar: `${validUser.avatar}`,
                    role: `${validUser.role}`,
                },
            });
        }
        return res.status(401).json({ message: 'Please verify your email' });
    }
    catch (error) {
        return res.status(500).json({ message: 'failed to login', route: '/login' });
    }
}
exports.userLogin = userLogin;
async function forgetPassword(req, res, next) {
    try {
        const validationResult = utils_1.fogotPasswordSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const { email } = req.body;
        const user = await userModel_1.userInstance.findOne({ email });
        if (!user) {
            return res.status(409).json({
                message: 'User not found',
            });
        }
        const token = (0, uuid_1.v4)();
        // const resetPasswordToken = await userInstance.({ token }, { where: { email } });
        user.token = token;
        await user.save();
        const email_response = await sendMails_1.default
            .forgotPassword(email, token)
            .then((email_response) => {
            return res.status(200).json({
                message: 'Reset password token sent to your email',
                token,
                email_response,
            });
        })
            .catch((err) => {
            res.status(500).json({
                message: 'Server error',
                err,
            });
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'failed to send reset password token',
            route: '/forgetPassword',
        });
    }
}
exports.forgetPassword = forgetPassword;
async function resetPassword(req, res, next) {
    try {
        // const { token } = req.params;
        const { password, token } = req.body;
        const validate = utils_1.resetPasswordSchema.validate(req.body, utils_1.options);
        if (validate.error) {
            return res.status(400).json({ Error: validate.error.details[0].message });
        }
        const user = await userModel_1.userInstance.findOne({ token });
        if (!user) {
            return res.status(404).json({
                message: 'Invalid Token',
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        user.password = passwordHash;
        user.token = 'null';
        await user.save();
        return res.status(202).json({
            message: 'Password reset successfully',
            user,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'failed to reset password',
            route: '/resetPassword',
        });
    }
}
exports.resetPassword = resetPassword;
async function userLogout(req, res, next) {
    try {
        // make sure to clear the cookie and not valid
        // res.clearCookie('jwt');
        // return res.status(200).json({ message: 'successfully logged out' });
        if (req.cookies.jwt) {
            res.clearCookie('jwt');
            return res.status(200).json({ message: 'successfully logged out' });
        }
        return res.status(200).json({ message: 'successfully logged out' });
    }
    catch (err) {
        return res.status(500).json({ message: 'failed to logout' });
    }
}
exports.userLogout = userLogout;
async function singleUser(req, res, next) {
    try {
        const { id } = req.user;
        const user = await userModel_1.userInstance.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User found', user });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'failed to get user' });
    }
}
exports.singleUser = singleUser;
async function allUsers(req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 15;
        const page = parseInt(req.query.page) || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const users = await userModel_1.userInstance.find({ where: { role: "user" }
        }).sort({ date: -1 }).skip(startIndex).limit(limit).exec();
        if (!users) {
            return res.status(404).json({ message: 'No user found' });
        }
        return res.status(200).json({ message: 'Users found', users, currentPage: page,
            hasPreviousPage: startIndex > 0,
            hasNextPage: endIndex < await userModel_1.userInstance.countDocuments().exec(),
            previousPage: page - 1,
            nextPage: page + 1,
            limit });
    }
    catch (err) {
        return res.status(500).json({ message: 'failed to get users' });
    }
}
exports.allUsers = allUsers;
async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;
        const user = await userModel_1.userInstance.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const deletedUser = await userModel_1.userInstance.findByIdAndDelete(id);
        return res.status(200).json({ message: 'User deleted', deletedUser });
    }
    catch (err) {
        return res.status(500).json({ message: 'failed to delete user' });
    }
}
exports.deleteUser = deleteUser;
async function getUserPost(req, res, next) {
    try {
        const { id } = req.params;
        const record = await userModel_1.userInstance.findById({
            id,
            include: [
                {
                    model: postModel_1.PostInstance,
                    as: 'posts',
                },
            ],
        });
        return res.status(200).json({
            status: 'success',
            message: 'post retrieved successfully',
            // data: record?.posts,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error,
        });
    }
}
exports.getUserPost = getUserPost;
async function allCommentOnPost(req, res, next) {
    try {
        const { id } = req.params;
        const record = await userModel_1.userInstance.find({});
        return res.status(200).json({
            status: 'success',
            message: 'Withdrawals retrieved successfully',
            data: record,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error,
        });
    }
}
exports.allCommentOnPost = allCommentOnPost;
// contact us by sending email full-name and message
async function contactUs(req, res, next) {
    try {
        const { fullName, email, message } = req.body;
        const validate = utils_1.contactUsSchema.validate(req.body, utils_1.options);
        if (validate.error) {
            return res.status(400).json({ Error: validate.error.details[0].message });
        }
        await contactUsModel_1.ContactUsInstance.create({
            fullName,
            email,
            message,
        });
        const contactUsResponse = await sendMails_1.default.contactUs(email, fullName, message);
        return res.status(200).json({
            message: 'Email sent successfully',
            route: '/contact-us',
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'failed to send email',
            route: '/contactUs',
        });
    }
}
exports.contactUs = contactUs;
async function uploadImage(req, res, next) {
    // upload file to filestack
    try {
        const file = req.files;
        const { id } = req.user;
        const user = await userModel_1.userInstance.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // const fileUrl = await
        const upploaddd = await (0, node_fetch_1.default)(`https://www.filestackapi.com/api/store/S3?key=${FILESTACK_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'image/png' },
            body: file.avatar.data,
        });
        user.avatar = upploaddd.url;
        await user.save();
        return res.status(200).json({ message: 'Image uploaded successfully', newImage: upploaddd.url });
    }
    catch (error) {
        return res.status(500).json({ message: 'failed to upload image', error });
    }
}
exports.uploadImage = uploadImage;
//# sourceMappingURL=userController.js.map