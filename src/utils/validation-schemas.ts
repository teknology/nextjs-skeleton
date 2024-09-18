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
const countryCodeSchema = z.string().min(1, { message: "Please select an option." })
const timezoneSchema = z.string().min(1, { message: "Please select an option." })


// Define a schema for the address
export const addressSchema = z.object({
  address1: z.string()
    .min(5, "Address line 1 must be at least 5 characters long")
    .max(100, "Address line 1 must be at most 100 characters long"),

  address2: z.string()
    .max(100, "Address line 2 must be at most 100 characters long")
    .optional(),  // Optional field for apartment or suite number

  city: z.string()
    .min(2, "City must be at least 2 characters long")
    .max(50, "City must be at most 50 characters long"),

  stateProvince: z.string()
    .max(50, "State or province must be at most 50 characters long")
    .optional(),  // Optional for countries that don't have states/provinces

  country: z.string()
    .length(2, "Country code must be exactly 2 characters (ISO 3166-1 alpha-2)"),

  zipcode: z.union([
    z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid US ZIP code"),  // US ZIP code format
    z.string().regex(/^[A-Z0-9\s-]{3,10}$/, "Invalid postal code")  // General postal code format for other countries
  ]),

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
  countryCode: countryCodeSchema,
  phoneNumber: phoneNumberSchema,
  biography: biographySchema,
  timezone: timezoneSchema
});

