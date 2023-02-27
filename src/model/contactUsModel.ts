import { Schema, model, connect } from 'mongoose';

export interface ContactUsAttribute {
  email?: string;
  message?: string;
  fullName?: string;
  date?: string;
}

export const ContactUsSchema = new Schema<ContactUsAttribute>({
  email: {
    type: String,
    allowNull: false,
  },

  fullName: {
    type: String,
    allowNull: false,
  },

  message: {
    type: String,
    allowNull: false,
  },

  date: {
    type: Date,
    default: Date.now(),
  },
});

ContactUsSchema.index({ $email: 'text', $message: 'text' });

export let ContactUsInstance = model('ContactUs', ContactUsSchema);
