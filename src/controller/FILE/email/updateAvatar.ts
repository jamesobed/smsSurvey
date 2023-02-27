import { Request, Response } from 'express';
import cloudinary from 'cloudinary';
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

const uploadImage = (image: string) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error?.message);
      return reject({ message: error?.message });
    });
  });
};

export default async (image: string) => {
  try {
    const result = await cloudinary.v2.uploader.upload(image, opts);
    // console.log(result.secure_url);
    return result.secure_url;
  } catch (error) {
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
