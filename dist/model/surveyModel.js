"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyInstance = exports.SurveySchema = void 0;
const mongoose_1 = require("mongoose");
exports.SurveySchema = new mongoose_1.Schema({
    medicalWorker: {
        type: Boolean,
        allowNull: false,
    },
    usedEMR: {
        type: Boolean,
        allowNull: false,
    },
    expectedWebsiteContent: {
        type: String,
        default: 'none',
    },
    nonHealthCareExperienceWithEMR: {
        type: String,
        default: 'none',
    },
    interestedWebsiteContent: {
        type: String,
        allowNull: false,
    },
    experienceWithEMR: {
        type: String,
        allowNull: false,
    },
    countryEMRWasUsed: {
        type: String,
        allowNull: false,
    },
    yearEMRWasUsed: {
        type: String,
        allowNull: false,
    },
    EMRDislikeAndImprovement: {
        type: String,
        allowNull: false,
    },
    newEMRFunctionalities: {
        type: String,
        allowNull: false,
    },
    userSummaryNigeriaEMR: {
        type: String,
        allowNull: false,
    },
    userEmail: {
        type: String,
        allowNull: false,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});
exports.SurveySchema.index({ $medicalWorker: 'text', $newEMRFunctionalities: 'text' });
exports.SurveyInstance = (0, mongoose_1.model)('surveys', exports.SurveySchema);
//# sourceMappingURL=surveyModel.js.map