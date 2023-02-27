import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import { createCommentSchema, options } from '../utils/utils';
import { CommentHistoryInstance } from '../model/commentHistoryModel';
import { PostInstance } from '../model/postModel';
import auth from '../utils/googleAuth';
const spreadsheetId = process.env.COMMENT_SHEET;

const client = auth.getClient();

export const createComments = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const { commentBody, postID, firstName, lastName } = req.body;

    const validatedInput = await createCommentSchema.validate(req.body, options);
    if (validatedInput.error) {
      return res.status(400).json(validatedInput.error.details[0].message);
    }
    const post = await PostInstance.findById(postID);
    if (!post) {
      return res.status(404).json({ message: 'post not found' });
    }
    if (post) {
      const comment = await CommentHistoryInstance.create({
        userId: userId,
        postID: postID,
        commentBody: commentBody,
        firstName,
        lastName,
      });

      const newPost = await PostInstance.findByIdAndUpdate(
        postID,
        {
          $push: { comments: comment },
        },
        { new: true },
      );
      const client = await auth.getClient();

      const googleSheets: any = google.sheets({
        version: 'v4',
        auth: client,
      });

      await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'Created!B:F',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[firstName, lastName, postID, userId, commentBody]],
        },
      });
      return res.status(201).json({
        message: 'You have successful commented on post',
        comment,
      });
    } else {
      return res.status(400).json({ message: 'Network Error. Comment not successful' });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

// get all comments
export const getAllComments = async (req: Request | any, res: Response | any, next: NextFunction) => {
  try {
    const client = await auth.getClient();

    const googleSheets: any = google.sheets({
      version: 'v4',
      auth: client,
    });

    const allComments = await CommentHistoryInstance.find();
    if (!allComments) {
      return res.status(404).json({ message: 'No Comments found' });
    }
    //  group comments by postID
    const groupedComments = allComments.reduce((acc: any, comment: any) => {
      const { postID } = comment;
      if (!acc[postID]) {
        acc[postID] = [];
      }
      acc[postID].push(comment);
      return acc;
    }, {});

    // const comments = Object.values(groupedComments);
    // console.log(groupedComments);
    // console.log();

    // console.log(comments);

    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: 'Database!B:F',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: allComments.map((comment) => [
          comment.firstName,
          comment.lastName,
          comment.postID,
          comment.userId,
          comment.commentBody,
        ]),
      },
    });

    return res.status(200).json({ message: 'Sucessfully fetched all comments' });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
