"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinaryFiles = require('cloudinary').v2;
const callCloudinary = () => {
    try {
        cloudinaryFiles.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
        });
    }
    catch (error) {
        console.error(error, 'this error is from the cloudinary file');
    }
};
exports.default = callCloudinary;
//# sourceMappingURL=cloud.js.map