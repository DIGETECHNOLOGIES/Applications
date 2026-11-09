import * as yup from 'yup';
import { normalizeWhatsApp } from './phone';

const answer = yup
  .string()
  .trim()
  .required('Please answer this question')
  .min(15, 'Please write a little more (at least 15 characters)')
  .max(1200, 'Please keep this under 1200 characters');

export const applicationSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required('Your name is required')
    .min(3, 'Please enter your full name')
    .max(100, 'That name is too long'),
  email: yup
    .string()
    .trim()
    .required('Your email is required')
    .email('Enter a valid email address')
    .max(160, 'That email is too long'),
  whatsapp: yup
    .string()
    .trim()
    .required('Your WhatsApp number is required')
    .test(
      'whatsapp',
      'Enter a valid WhatsApp number, e.g. 6XX XXX XXX or +237 6XX XXX XXX',
      (value) => !!value && normalizeWhatsApp(value) !== null,
    ),
  school: yup.string().trim().required('Your school is required').max(150, 'That is too long'),
  department: yup.string().trim().required('Your department is required').max(150, 'That is too long'),
  yearOfStudy: yup
    .string()
    .oneOf(['1', '2'] as const, 'Select Year 1 or Year 2')
    .required('Select your year of study'),
  knowsAboutKash: answer,
  improvements: answer,
  contribution: answer,
  learning: answer,
  // Honeypot: real people never see or fill this field.
  website: yup.string().default(''),
});

export type ApplicationInput = yup.InferType<typeof applicationSchema>;
