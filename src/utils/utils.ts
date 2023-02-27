import Joi from 'joi';
import jwt from 'jsonwebtoken';
export const sendEmail = Joi.object().keys({
  from: Joi.string(),
  to: Joi.string().required(),
  subject: Joi.string().required(),
  text: Joi.string(),
  html: Joi.string().required(),
});

export const signUpSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    occupation: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    email: Joi.string().trim().lowercase().required(),
    phoneNumber: Joi.string(),
    avatar: Joi.string(),
    role: Joi.string(),
    isVerified: Joi.boolean(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match' }),
  })
  .with('password', 'confirmPassword');

export const updateUserSchema = Joi.object().keys({
  name: Joi.string(),
  occupation: Joi.string(),
  phoneNumber: Joi.string(),
  avatar: Joi.string(),
  dateOfBirth: Joi.string(),
  role: Joi.string(),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});
export const fogotPasswordSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
});

export const resetPasswordSchema = Joi.object()
  .keys({
    token: Joi.string().trim().lowercase().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match' }),
  })
  .with('password', 'confirmPassword');

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};

export const generateToken = (user: { [key: string]: unknown }): unknown => {
  const pass = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_DURATION as string;
  return jwt.sign(user, pass, { expiresIn });
};

export const createPostSchema = Joi.object().keys({
  postTitle: Joi.string().trim().required(),
  postBody: Joi.string().trim().required(),
  userSummary: Joi.string().required(),
  category: Joi.string().required(),
  author: Joi.string().required(),
  postImage: Joi.string().trim().required(),
});

export const createCommentSchema = Joi.object().keys({
  commentBody: Joi.string().required(),
  postID: Joi.string().trim().required(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
});

export const generateOtp = Joi.object().keys({
  purpose: Joi.string().required(),
});

export const CreateSurveySchema = Joi.object().keys({
  medicalWorker: Joi.boolean().required(),
  usedEMR: Joi.boolean().required(),
  experienceWithEMR: Joi.string().required(),
  nonHealthCareExperienceWithEMR: Joi.string().required(),
  expectedWebsiteContent: Joi.string().required(),
  interestedWebsiteContent: Joi.string().required(),
  countryEMRWasUsed: Joi.string().required(),
  yearEMRWasUsed: Joi.string().required(),
  EMRDislikeAndImprovement: Joi.string().required(),
  newEMRFunctionalities: Joi.string().required(),
  userSummaryNigeriaEMR: Joi.string().required(),
  userEmail: Joi.string().required(),
});

// contact us schema with full name, email, message
export const contactUsSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  email: Joi.string().required(),
  message: Joi.string().required(),
});
// contact us schema with full name, email, message
export const ImgSch = Joi.object().keys({
  avatar: Joi.string().required(),
});
export const suscribeSchema = Joi.object().keys({
  email: Joi.string().required(),
});
