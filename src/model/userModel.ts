import { Schema, model } from 'mongoose';
// import { PostAttribute } from './postModel';

export interface userAttributes {
  id: string;
  name: string;
  occupation: string;
  dateOfBirth: string;
  email: string;
  phoneNumber?: string;
  password: string;
  avatar: string;
  isVerified?: Boolean;
  notify?: Boolean;
  token?: string;
  role?: string;
  date?: string;
  gender?: string;
  filledSurveyForm?: boolean;
  surveyDate?: string;
  cloudinary_id?: string;
}

export const UserSchema = new Schema<userAttributes>({
  name: {
    type: String,
    required: [true, 'full name is required'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'Please provide occupation'],
    trim: true,
  },
  dateOfBirth: {
    type: String,
    required: [true, 'Please provide date of birth'],
    trim: true,
  },
  email: {
    type: String,
    trim: false,
    required: [true, 'Please provide a valid email'],
    unique: true,
  },
  phoneNumber: {
    type: String,
    default: '09000000000',
  },
  password: {
    type: String,
    required: [true, 'enter a password'],
    trim: true,
    min: 5,
    max: 200,
  },
  avatar: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7nG8OgXmMOXXiwbNOc-PPXUcilcIhCkS9BQ&usqp=CAU',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: 'user',
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  gender: {
    type: String,
    default: '',
  },
  notify: {
    type: Boolean,
    default: true,
  },
  filledSurveyForm: {
    type: Boolean,
    default: false,
  },
  cloudinary_id: {
    type: String,
    default: '',
  },
  surveyDate: {
    type: String,
    default: '',
  },
});

UserSchema.index({ request: 'text' });
export let userInstance = model('User', UserSchema);
