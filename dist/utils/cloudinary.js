"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImg = exports.uploadImg = void 0;
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
//Upload image to cloudinary
const uploadImg = async (avatar) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(avatar, {
            allowed_formats: ['png', 'jpg', 'jpeg', 'svg'],
            public_id: '',
            folder: 'userImages',
        });
        return result.secure_url;
    }
    catch (err) {
        console.error(err);
        return null;
    }
};
exports.uploadImg = uploadImg;
//Delete image from cloudinary
const deleteImg = async (url) => {
    const parts = url.split('/').slice(-2);
    parts[1] = parts[1].split('.')[0];
    const id = parts.join('/');
    try {
        return await cloudinary_1.v2.uploader.destroy(id);
    }
    catch (err) {
        console.error(err);
    }
};
exports.deleteImg = deleteImg;
//# sourceMappingURL=cloudinary.js.map