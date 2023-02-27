import { Schema, model, connect } from 'mongoose';
import { userAttributes } from './userModel';

export interface SurveyAttribute {
  id?: string;
  medicalWorker?: boolean;
  usedEMR?: boolean;
  experienceWithEMR?: string;
  nonHealthCareExperienceWithEMR?: string;
  expectedWebsiteContent?: string;
  interestedWebsiteContent?: string;
  countryEMRWasUsed?: string;
  yearEMRWasUsed?: string;
  EMRDislikeAndImprovement?: string;
  newEMRFunctionalities?: string;
  userSummaryNigeriaEMR?: string;
  userEmail?: string;
  date?: string;
}

export const SurveySchema = new Schema<SurveyAttribute>({
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

SurveySchema.index({ $medicalWorker: 'text', $newEMRFunctionalities: 'text' });

export let SurveyInstance = model('surveys', SurveySchema);
