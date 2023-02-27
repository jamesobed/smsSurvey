"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSurveys = exports.createSurvey = exports.sendSurveyNotification = void 0;
const surveyModel_1 = require("../model/surveyModel");
const userModel_1 = require("../model/userModel");
const sendMails_1 = __importDefault(require("./FILE/email/sendMails"));
const utils_1 = require("../utils/utils");
const googleapis_1 = require("googleapis");
const googleAuth_1 = __importDefault(require("../utils/googleAuth"));
const spreadsheetId = process.env.COMMENT_SHEET;
async function sendSurveyNotification() {
    try {
        const message = `A new survey has been created by ISDS`;
        // const allUsers = await userInstance.find({ isVerified: true });
        const allUsers = await userModel_1.userInstance.find();
        const emails = allUsers.map((user) => {
            let oldDate = user.date;
            const date = new Date(oldDate);
            const currentDate = new Date();
            const diff = Math.abs(currentDate - date);
            const hours = Math.floor(diff / 3600000);
            // console.log(hours);
            let output = Math.ceil(hours / 24);
            // if (output > 7) {
            return sendMails_1.default.surveyNotification(user.email, message);
            // }
        });
    }
    catch (error) {
        return error.message;
    }
}
exports.sendSurveyNotification = sendSurveyNotification;
async function createSurvey(req, res) {
    try {
        const { medicalWorker, usedEMR, expectedWebsiteContent, nonHealthCareExperienceWithEMR, interestedWebsiteContent, experienceWithEMR, countryEMRWasUsed, yearEMRWasUsed, EMRDislikeAndImprovement, newEMRFunctionalities, userSummaryNigeriaEMR, userEmail, } = req.body;
        const validatedInput = utils_1.CreateSurveySchema.validate(req.body, utils_1.options);
        if (validatedInput.error) {
            return res.status(400).json({
                status: "error",
                message: validatedInput.error.details[0].message,
            });
        }
        const user = await userModel_1.userInstance.findOne({ email: userEmail });
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
        const client = await googleAuth_1.default.getClient();
        const googleSheets = googleapis_1.google.sheets({
            version: "v4",
            auth: client,
        });
        await googleSheets.spreadsheets.values.append({
            auth: googleAuth_1.default,
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
        const survey = await surveyModel_1.SurveyInstance.create({
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
            await userModel_1.userInstance.findOneAndUpdate({ email: userEmail }, { filledSurveyForm: true, date: Date.now() });
            return res.status(201).json({
                status: "success",
                message: "Survey created successfully",
                data: survey,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: "internal server error",
        });
    }
}
exports.createSurvey = createSurvey;
async function getAllSurveys(req, res) {
    try {
        const surveys = await surveyModel_1.SurveyInstance.find();
        if (surveys) {
            const client = await googleAuth_1.default.getClient();
            const googleSheets = googleapis_1.google.sheets({
                version: "v4",
                auth: client,
            });
            await googleSheets.spreadsheets.values.append({
                auth: googleAuth_1.default,
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
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: "internal server error",
        });
    }
}
exports.getAllSurveys = getAllSurveys;
//# sourceMappingURL=surveyController.js.map