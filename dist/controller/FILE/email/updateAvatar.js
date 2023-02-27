"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
// import cloudinary from '../../../utils/cloud';
// export async function uploadImg(req: Request | any, res: Response) {
//   try {
//     console.log('we are at controller fun');
//     console.log(req.file);
//     const result = await cloudinary.uploader.upload(req.file.path);
//     return res.status(201).json({ result: 'success' });
//   } catch (err) {
//     console.log(err);
//   }
// }
const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto',
};
const uploadImage = (image) => {
    //imgage = > base64
    return new Promise((resolve, reject) => {
        cloudinary_1.default.v2.uploader.upload(image, opts, (error, result) => {
            if (result && result.secure_url) {
                console.log(result.secure_url);
                return resolve(result.secure_url);
            }
            console.log(error === null || error === void 0 ? void 0 : error.message);
            return reject({ message: error === null || error === void 0 ? void 0 : error.message });
        });
    });
};
exports.default = async (image) => {
    try {
        const result = await cloudinary_1.default.v2.uploader.upload(image, opts);
        // console.log(result.secure_url);
        return result.secure_url;
    }
    catch (error) {
        console.log(error);
    }
    //imgage = > base64
    // return new Promise((resolve, reject) => {
    //   cloudinary.v2.uploader.upload(image, opts, (error, result) => {
    //     if (result && result.secure_url) {
    //       console.log(result.secure_url);
    //       return resolve(result.secure_url);
    //     }
    //     console.log(error?.message);
    //     return reject({ message: error?.message });
    //   });
    // });
};
//# sourceMappingURL=updateAvatar.js.map