import { Schema, model, connect } from 'mongoose';

export interface CommentHistoryAttribute {
  id: string;
  commentBody: string;
  userId: string;
  postID: string;
  firstName: string;
  lastName: string;
  createdAt?: Date;
}

export const commentSchema = new Schema<CommentHistoryAttribute>({
  commentBody: {
    type: String,
    allowNull: false,
  },
  userId: {
    type: String,
    allowNull: false,
  },
  postID: {
    type: String,
    defaultValue: false,
  },
  firstName: {
    type: String,
    allowNull: false,
  },
  lastName: {
    type: String,
    allowNull: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

commentSchema.index({ $commentBody: 'text', $firstName: 'text' });

export let CommentHistoryInstance = model('comments', commentSchema);
