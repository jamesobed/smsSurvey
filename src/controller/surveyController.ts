import { Request, Response } from "express";
import { SurveyInstance } from "../model/surveyModel";
import { userInstance } from "../model/userModel";
import sendMails from "./FILE/email/sendMails";
import { CreateSurveySchema, options } from "../utils/utils";
import { google } from "googleapis";
import auth from "../utils/googleAuth";
const spreadsheetId = process.env.COMMENT_SHEET;

export async function sendSurveyNotification(): Promise<any> {
  try {
    const message = `A new survey has been created by ISDS`;

    // const allUsers = await userInstance.find({ isVerified: true });
    const allUsers = await userInstance.find();
    const emails: any = allUsers.map((user) => {
      let oldDate: any = user.date;
      const date: any = new Date(oldDate);
      const currentDate: any = new Date();
      const diff: any = Math.abs(currentDate - date);
      const hours = Math.floor(diff / 3600000);
      // console.log(hours);
      let output = Math.ceil(hours / 24);
      // if (output > 7) {
      return sendMails.surveyNotification(user.email, message);
      // }
    });
  } catch (error: any) {
    return error.message;
  }
}

export async function createSurvey(req: Request | any, res: Response) {
  try {
    const {
      medicalWorker,
      usedEMR,
      expectedWebsiteContent,
      nonHealthCareExperienceWithEMR,
      interestedWebsiteContent,
      experienceWithEMR,
      countryEMRWasUsed,
      yearEMRWasUsed,
      EMRDislikeAndImprovement,
      newEMRFunctionalities,
      userSummaryNigeriaEMR,
      userEmail,
    } = req.body;

    const validatedInput = CreateSurveySchema.validate(req.body, options);
    if (validatedInput.error) {
      return res.status(400).json({
        status: "error",
        message: validatedInput.error.details[0].message,
      });
    }
    const user = await userInstance.findOne({ email: userEmail });
    if (user) {
      if (user.filledSurveyForm) {
        return res.status(400).json({
          status: "error",
          message: "You have already submitted a survey",
        });
      }
    }

    if (!user) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "You are not a registered user",
        })
        .redirect(`${process.env.FRONTEND_URL}/signup`);
    }
    const client = await auth.getClient();

    const googleSheets: any = google.sheets({
      version: "v4",
      auth: client,
    });

    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Created_Survey!B:F",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            medicalWorker,
            usedEMR,
            expectedWebsiteContent,
            nonHealthCareExperienceWithEMR,
            interestedWebsiteContent,
            experienceWithEMR,
            countryEMRWasUsed,
            yearEMRWasUsed,
            EMRDislikeAndImprovement,
            newEMRFunctionalities,
            userSummaryNigeriaEMR,
            userEmail,
          ],
        ],
      },
    });

    const survey = await SurveyInstance.create({
      medicalWorker,
      usedEMR,
      expectedWebsiteContent,
      nonHealthCareExperienceWithEMR,
      interestedWebsiteContent,
      experienceWithEMR,
      countryEMRWasUsed,
      yearEMRWasUsed,
      EMRDislikeAndImprovement,
      newEMRFunctionalities,
      userSummaryNigeriaEMR,
      userEmail,
    });
    if (survey) {
      await userInstance.findOneAndUpdate(
        { email: userEmail },
        { filledSurveyForm: true, date: Date.now() }
      );
      return res.status(201).json({
        status: "success",
        message: "Survey created successfully",
        data: survey,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
}

export async function getAllSurveys(req: Request, res: Response) {
  try {
    const surveys = await SurveyInstance.find();
    if (surveys) {
      const client = await auth.getClient();

      const googleSheets: any = google.sheets({
        version: "v4",
        auth: client,
      });

      await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Gotten_Survey!B:F",
        valueInputOption: "USER_ENTERED",
        resource: {
          values: surveys.map((survey) => [
            survey.medicalWorker,
            survey.usedEMR,
            survey.expectedWebsiteContent,
            survey.nonHealthCareExperienceWithEMR,
            survey.interestedWebsiteContent,
            survey.experienceWithEMR,
            survey.countryEMRWasUsed,
            survey.yearEMRWasUsed,
            survey.EMRDislikeAndImprovement,
            survey.newEMRFunctionalities,
            survey.userSummaryNigeriaEMR,
            survey.userEmail,
          ]),
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Surveys retrieved successfully",
        data: surveys,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
}
