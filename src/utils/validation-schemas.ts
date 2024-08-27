import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one non-alphanumeric character' });

const firstNameSchema = z.string().min(2, { message: 'First name must be at least 2 characters long' });
const lastNameSchema = z.string().min(2, { message: 'Last name must be at least 2 characters long' });
const emailSchema = z.string().email('Invalid email address');
const titleSchema = z.string().min(2, { message: 'Title must be at least 2 characters long' });
const phoneNumberSchema = z.number().min(10, { message: 'Phone number must be at least 10 characters long' });
const biographySchema = z.string().min(10, { message: 'Biography must be at least 10 characters long' });
const countryCodeSchema = z.string().min(1, { message: "Please select an option." })
const timezoneSchema = z.string().min(1, { message: "Please select an option." })



//Registration Schema
export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  //TODO: Add agreeTerms check box validation
  // agreeTerms: z.boolean().refine(data => data === true, { message: 'You must agree to the terms' })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

//Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

export const profileSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  title: titleSchema,
  countryCode: countryCodeSchema,
  phoneNumber: phoneNumberSchema,
  biography: biographySchema,
  timezone: timezoneSchema
});

