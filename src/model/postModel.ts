import { Schema, model, connect } from 'mongoose';
import { CommentHistoryAttribute } from './commentHistoryModel';

export interface PostAttribute {
  postTitle?: string;
  postBody?: string;
  postImage?: string;
  userSummary?: string;
  userId?: string;
  date?: string;
  comments?: CommentHistoryAttribute;
  author?: string;
  category?: string;
}

export const PostSchema = new Schema<PostAttribute>({
  postTitle: {
    type: String,
    allowNull: false,
  },

  postBody: {
    type: String,
    allowNull: false,
  },

  postImage: {
    type: String,
    allowNull: false,
  },
  userSummary: {
    type: String,
    allowNull: false,
  },

  userId: {
    type: String,
    allowNull: false,
  },
  category: {
    type: String,
    enum: [
      'health care',
      'software trends',
      'public health',
      'research methodology',
      'research outcomes',
      'research findings',
      'electronic medical records',
      'healthcare interventions',
    ],
    allowNull: false,
  },
  author: {
    type: String,
    allowNull: false,
  },

  date: {
    type: Date,
    default: Date.now(),
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
});

PostSchema.index({ $postTitle: 'text', $userSummary: 'text' });

export let PostInstance = model('posts', PostSchema);
