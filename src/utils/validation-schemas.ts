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
const biographySchema = z.string().min(10, { message: 'Biography must be at least 10 characters long' }).optional();
const countryCodeIdSchema = z.number().min(1, { message: "Please select an option." })
const timezoneIdSchema = z.number().min(1, { message: "Please select an option." })
const address1Schema = z.string().min(5, { message: 'Address line 1 must be at least 5 characters long' });
const address2Schema = z.string().max(100, { message: 'Address line 2 must be at most 100 characters long' }).optional();
const citySchema = z.string().min(2, { message: 'City must be at least 2 characters long' });
const stateProvinceIdSchema = z.number().min(1, { message: 'Please select a state/province' });
const zipcodeSchema = z.union([
  z.string().regex(/^\d{5}(-\d{4})?$/, { message: 'Invalid US ZIP code' }),  // US ZIP code format
  z.string().regex(/^[A-Z0-9\s-]{3,10}$/, { message: 'Invalid postal code' })  // General postal code format for other countries
]);
const addressTypeSchema = z.string().min(2, { message: 'Address type must be at least 2 characters long' }).optional();


// Define a schema for the address
export const addressSchema = z.object({
  address1: address1Schema,
  address2: address2Schema,
  city: citySchema,
  stateProvinceId: stateProvinceIdSchema,
  countryCodeId: countryCodeIdSchema,
  zipcode: zipcodeSchema,
  addressType: addressTypeSchema
});


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
  countryCodeId: countryCodeIdSchema,
  phoneNumber: phoneNumberSchema,
  biography: biographySchema,
  timezoneId: timezoneIdSchema
});

export const inviteSchema = z.object({
  email: emailSchema
});