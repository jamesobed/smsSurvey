import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import {
  signUpSchema,
  updateUserSchema,
  options,
  generateToken,
  loginSchema,
  resetPasswordSchema,
  fogotPasswordSchema,
  contactUsSchema,
  ImgSch,
} from '../utils/utils';
import { userInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';
import sendMails from './FILE/email/sendMails';
import { PostInstance } from '../model/postModel';
import { ContactUsInstance } from '../model/contactUsModel';
import uploadImg from '../controller/FILE/email/updateAvatar';

const FILESTACK_KEY = process.env.FILESTACK_KEY;
const backendURL ="https://isdservices.herokuapp.com"

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = signUpSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const duplicateEmail = await userInstance.findOne({ email: req.body.email });
    if (duplicateEmail) {
      return res.status(409).json({
        message: 'Email is used, please change email',
      });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10),
     token = uuidv4(),
     link = `https://isdservices.herokuapp.com/user/verify/${token}`,
     role = req.body.email.endsWith('@isdservices.org')?'admin':'user'

    const record = await userInstance.create({
      name: req.body.name,
      occupation: req.body.occupation,
      dateOfBirth: req.body.dateOfBirth,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: passwordHash,
      avatar: req.body.avatar,
      isVerified: req.body.isVerified || false,
      token,
      role,
    });

    sendMails.verifyUserEmail(record.email, token);

    return res.status(201).json({
      message: 'Successfully created a user',
      record: {
        id: record.id,
        name: record.name,
        phoneNumber: record.phoneNumber,
        email: record.email,
        avatar: record.avatar,
        isVerified: record.isVerified,
        token: record.token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: 'failed to register',
      route: '/register',
    });
  }
}

export async function verifyUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;
    const user = await userInstance.findOne({ token });
    if (!user) {
      return res
        .status(404)
        .json({
          message: 'User not found',
        })
        .redirect(`${process.env.FRONTEND_URL}/${token}`);
    }

    if (user) {
      user.isVerified = true;
      user.token = 'null';
      await user.save();
      const id = user.id;
      return res.status(200).redirect(`${process.env.FRONTEND_URL}/login`);
    }
  } catch (err) {
    return res.status(500).json({
      message: 'failed to verify user',
      route: '/verify/:id',
    });
  }
}
export async function resendVerificationLink(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = fogotPasswordSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const { email } = req.body;
    const user = await userInstance.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    if (user.isVerified) {
      return res.status(409).json({
        message: 'Email already verified',
      });
    }

    if (user) {
      const token = uuidv4();
      user.token = token ? token : user.token;

      await user.save();
      const email_response = await sendMails
        .resendVerificationLink(user.email, token)
        .then((email_response) => {
          return res.status(200).json({
            message: 'Verification link sent successfully',
            // token,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: 'Server error',
            err,
          });
        });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'failed to resend verification link',
      route: '/resend-verification-link',
    });
  }
}

export async function updateUser(req: Request | any, res: Response, next: NextFunction) {
  try {
    console.log(req.body);

    const id = req.user.id;

    const record = await userInstance.findById(id);

    const { name, avatar, occupation, dateOfBirth, phoneNumber, notify } = req.body;
    const validationResult = updateUserSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    if (!record) {
      return res.status(404).json({
        message: 'cannot find user',
      });
    }

    record.name = name ? name : record.name;
    record.occupation = occupation ? occupation : record.occupation;
    record.dateOfBirth = dateOfBirth ? dateOfBirth : record.dateOfBirth;
    record.phoneNumber = phoneNumber ? phoneNumber : record.phoneNumber;
    record.avatar = avatar ? avatar : record.avatar;
    record.notify = notify ? notify : record.notify;
    record.role = req.body.role || 'user';

    await record.save();

    return res.status(202).json({
      message: 'successfully updated user details',
      update: record,
    });
  } catch (err) {
    return res.status(500).json({ message: 'failed to update user details, check image format', err });
  }
}
export async function userLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const validate = loginSchema.validate(req.body, options);
    if (validate.error) {
      return res.status(401).json({ Error: validate.error.details[0].message });
    }

    let validUser = (await userInstance.findOne({ email: email.trim('').toLowerCase() })) as unknown as {
      [key: string]: string;
    };

    if (!validUser) {
      return res.status(401).json({ message: 'User is not registered' });
    }
    const { id } = validUser;
    const token = generateToken({ id });
    const validatedUser = await bcrypt.compare(password, validUser.password);
    if (!validatedUser) {
      return res.status(401).json({ message: 'failed to login, wrong user email/password inputed' });
    }
    if (validUser.isVerified && validatedUser) {
      return res
        .cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        .status(200)
        .json({
          message: 'Successfully logged in',
          id,
          token,
          user_info: {
            name: `${validUser.name} `,
            occupation: `${validUser.occupation}`,
            email: `${validUser.email}`,
            avatar: `${validUser.avatar}`,
            role: `${validUser.role}`,
          },
        });
    }
    return res.status(401).json({ message: 'Please verify your email' });
  } catch (error) {
    return res.status(500).json({ message: 'failed to login', route: '/login' });
  }
}
export async function forgetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = fogotPasswordSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const { email } = req.body;
    const user = await userInstance.findOne({ email });
    if (!user) {
      return res.status(409).json({
        message: 'User not found',
      });
    }
    const token = uuidv4();
    // const resetPasswordToken = await userInstance.({ token }, { where: { email } });
    user.token = token;
    await user.save();

    const email_response = await sendMails
      .forgotPassword(email, token)
      .then((email_response) => {
        return res.status(200).json({
          message: 'Reset password token sent to your email',
          token,
          email_response,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Server error',
          err,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: 'failed to send reset password token',
      route: '/forgetPassword',
    });
  }
}
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    // const { token } = req.params;
    const { password,token } = req.body;
    const validate = resetPasswordSchema.validate(req.body, options);
    if (validate.error) {
      return res.status(400).json({ Error: validate.error.details[0].message });
    }
    const user = await userInstance.findOne({ token });
    if (!user) {
      return res.status(404).json({
        message: 'Invalid Token',
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    user.token = 'null';
    await user.save();
    return res.status(202).json({
      message: 'Password reset successfully',
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'failed to reset password',
      route: '/resetPassword',
    });
  }
}
export async function userLogout(req: Request, res: Response, next: NextFunction) {
  try {
    // make sure to clear the cookie and not valid
    // res.clearCookie('jwt');
    // return res.status(200).json({ message: 'successfully logged out' });

    if (req.cookies.jwt) {
      res.clearCookie('jwt');
      return res.status(200).json({ message: 'successfully logged out' });
    }
    return res.status(200).json({ message: 'successfully logged out' });
  } catch (err) {
    return res.status(500).json({ message: 'failed to logout' });
  }
}
export async function singleUser(req: Request|any, res: Response, next: NextFunction) {
  try {
    const { id } = req.user;
    const user = await userInstance.findById( id );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User found', user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'failed to get user' });
  }
}

export async function allUsers(req: Request|any, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page-1)*limit;
    const endIndex = page *limit;

    const users = await userInstance.find(
      { where : { role : "user" }
     
    }).sort({ date: -1 }).skip(startIndex).limit(limit).exec();
    if (!users) {
      return res.status(404).json({ message: 'No user found' });
    }
    return res.status(200).json({ message: 'Users found', users,currentPage:page,
    hasPreviousPage:startIndex > 0,
    hasNextPage:endIndex < await userInstance.countDocuments().exec(),
    previousPage: page - 1,
    nextPage: page + 1,
    limit });
  } catch (err) {
    return res.status(500).json({ message: 'failed to get users' });
  }
}
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await userInstance.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const deletedUser = await userInstance.findByIdAndDelete(id);
    return res.status(200).json({ message: 'User deleted', deletedUser });
  } catch (err) {
    return res.status(500).json({ message: 'failed to delete user' });
  }
}

export async function getUserPost(req: Request | any, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const record = await userInstance.findById({
      id,
      include: [
        {
          model: PostInstance,
          as: 'posts',
        },
      ],
    });
    return res.status(200).json({
      status: 'success',
      message: 'post retrieved successfully',
      // data: record?.posts,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
}

export async function allCommentOnPost(req: Request | any, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const record = await userInstance.find({});

    return res.status(200).json({
      status: 'success',
      message: 'Withdrawals retrieved successfully',
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
}

// contact us by sending email full-name and message
export async function contactUs(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, email, message } = req.body;
    const validate = contactUsSchema.validate(req.body, options);
    if (validate.error) {
      return res.status(400).json({ Error: validate.error.details[0].message });
    }
    await ContactUsInstance.create({
      fullName,
      email,
      message,
    });

    const contactUsResponse = await sendMails.contactUs(email, fullName, message);

    return res.status(200).json({
      message: 'Email sent successfully',
      route: '/contact-us',
    });
  } catch (err) {
    return res.status(500).json({
      message: 'failed to send email',
      route: '/contactUs',
    });
  }
}

export async function uploadImage(req: Request | any, res: Response, next: NextFunction) {
  // upload file to filestack
  try {
    const file = req.files;

    const { id } = req.user;
    const user = await userInstance.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // const fileUrl = await
    const upploaddd = await fetch(`https://www.filestackapi.com/api/store/S3?key=${FILESTACK_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'image/png' },
      body: file.avatar.data,
    });
    user.avatar = upploaddd.url;
    await user.save();
    return res.status(200).json({ message: 'Image uploaded successfully', newImage: upploaddd.url });
  } catch (error) {
    return res.status(500).json({ message: 'failed to upload image', error });
  }
}
