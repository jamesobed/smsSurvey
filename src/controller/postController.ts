import express, { Request, Response, NextFunction } from 'express';
import { createPostSchema, options } from '../utils/utils';
import sendMails from './FILE/email/sendMails';
import { userAttributes, userInstance } from '../model/userModel';
import sampleImages from './FILE/medicalImages/sample';
import fetch from 'node-fetch';
import { PostInstance } from '../model/postModel';
import uploadImg from '../controller/FILE/email/updateAvatar';

const FILESTACK_KEY = process.env.FILESTACK_KEY;

export async function createPost(req: Request | any, res: Response, next: NextFunction) {
  try {
    const userID = req.user.id;
    const ValidatePost = await createPostSchema.validateAsync(req.body, options);
    if (ValidatePost.error) {
      return res.status(400).json({
        status: 'error',
        message: ValidatePost.error.details[0].message,
      });
    }
    const user: userAttributes | any = await userInstance.findById(userID);
    let postImg:any
    let optionImg =sampleImages[Math.floor(Math.random() * sampleImages.length)]
 
      
    const record = await PostInstance.create({
      postTitle: req.body.postTitle,
      postBody: req.body.postBody,
      category: req.body.category.toLowerCase().trim(),
      postImage: req.body.postImage,
      userSummary: req.body.userSummary,
      userId: userID,
      author: req.body.author,
    });
    if (record) {
      const allUsers = await userInstance.find({ isVerified: true, notify: true });
      const emails = allUsers.map((user) => user.email);

      const message = `A new post has been created by ${user.occupation}. ${user.name} with the title: <b>${req.body.postTitle}</b>`;
      sendMails.postNotification(emails, message);

      return res.status(201).json({
        status: 'success',
        message: 'Post created successfully',
        data: record,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}
export async function getAllUserPost(req: Request | any, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const allPost = await PostInstance.findById({
      userId,
    }).populate('comments');
    if (allPost) {
      return res.status(200).json({
        status: 'success',
        message: 'all post retrieved successfully',
        data: allPost,
      });
    }
    
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}
export async function getAllPost(req: Request | any, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page-1)*limit;
    const endIndex = page *limit;


    const allPost = await PostInstance.find({}).sort({ date: -1 }).skip(startIndex).limit(limit).populate('comments').exec();
    if (allPost) {
      // get all post, comments and post author
      return res.status(200).json({
        status: 'success',
        message: 'all post retrieved successfully',
        data: allPost,
        currentPage:page,
        hasPreviousPage:startIndex > 0,
        hasNextPage:endIndex < await PostInstance.countDocuments().exec(),
        previousPage: page - 1,
        nextPage: page + 1,
        limit
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}
export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const post = await PostInstance.findByIdAndDelete(
      id
    );
    if (post) {
      return res.status(200).json({
        status: 'success',
        message: 'Post deleted successfully',
      });
    }
    return res.status(404).json({
      status: 'error',
      message: 'Post not found',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}
export async function getUserPost(req: Request | any, res: Response, next: NextFunction) {
  try {
    const userID = req.user.id;
    const post = await PostInstance.find({
      where: { userId: userID },
    });
    if (post) {
      return res.status(200).json({
        status: 'success',
        message: 'Post retrieved successfully',
        data: post,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}

export async function getSinglePost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const post = await PostInstance.findById(id).populate('comments').sort({ createdAt: -1 }).exec();

    if (post) {
      return res.status(200).json({
        status: 'success',
        message: 'Post retrieved successfully',
        data: post,
      });
    }
    return res.status(404).json({
      status: 'error',
      message: 'Post not found',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}
// export async function updatePost(req: Request, res: Response, next: NextFunction) {
//   try {
//     const {id} = req.params.id;
//     const post = await PostInstance.findByIdAndUpdate {
//       id,
//       req.body,
//     };
//     if (post) {
//       return res.status(200).json({
//         status: 'success',
//         message: 'Post updated successfully',
//         data: post,
//       });
//     }
//     return res.status(404).json({
//       status: 'error',
//       message: 'Post not found',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 'error',
//       message: 'internal server error',
//     });

//   }
// }
