'use server';

import * as auth from '@/auth'; // Import authentication methods
import { loginSchema, registrationSchema } from '@/utils/validation-schemas'; // Import validation schemas
import { createUser, getUserByEmail } from '@/db/queries/user'; // Import user database queries
import { SignInPasswordFormState } from '@/utils/types/types'; // Import form state types

// Redirect path after login
const loginRedirect = '/my-account';

/**
 * Sign in with Google authentication.
 * Redirects to '/my-account' after successful sign-in.
 * @returns Result of the Google sign-in attempt.
 */
export async function signInGoogle() {
    return await auth.signIn("google", { redirectTo: loginRedirect });
}

/**
 * Sign in with credentials (email and password).
 * Validates the form data and attempts to authenticate the user.
 * @param formState - The state of the form, including any existing errors.
 * @param formData - The form data submitted by the user.
 * @returns Updated form state with errors if the sign-in fails.
 */
export async function signInPassword(
    formState: SignInPasswordFormState,
    formData: FormData
): Promise<SignInPasswordFormState> {

    // Extract email and password from the form data
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate the form input using the login schema
    const result = await loginSchema.safeParse({
        email: email,
        password: password
    });

    // Check if a user with the provided email exists
    const user = await getUserByEmail(email);
    if (!user) {
        return {
            errors: {
                email: ['User not found']
            }
        };
    }

    // Check if the user has a password set
    if (!user.password || user.password === '' || user.password === null) {
        return {
            errors: {
                password: ['Password not set. Please reset your password']
            }
        };
    }

    // If form validation failed, return the validation errors
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        };
    }

    try {
        // Attempt to sign in with credentials
        const result = await auth.signIn('credentials', {
            redirectTo: loginRedirect,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            user: user
        });

    } catch (error) {
        // Handle known and unknown errors during sign-in
        if (error instanceof Error) {
            return {
                errors: {
                    _form: [error.message]
                },
            };
        } else {
            return {
                errors: {
                    _form: ['An unknown error occurred']
                }
            };
        }
    }

    // Return an empty error object if the sign-in was successful
    return {
        errors: {}
    };
}

/**
 * Register a new user with an email and password.
 * Validates the form data and creates a new user in the database.
 * @param formState - The state of the form, including any existing errors.
 * @param formData - The form data submitted by the user.
 * @returns Updated form state with errors if registration fails.
 */
interface RegisterUserFormState {
    errors: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        // TODO: Add agreeTerms check box validation  
        //   agreeTerms?: string[];
        _form?: string[];
    }
}
export async function signUpPassword(formState: RegisterUserFormState,
    formData: FormData): Promise<RegisterUserFormState> {

    // Validate the registration form input using the registration schema
    const result = registrationSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        // TODO: Add agreeTerms check box validation
        // agreeTerms: formData.get('agreeTerms')
    });

    // If validation fails, return the validation errors
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        };
    }

    // Check if a user with the provided email already exists
    const user = await getUserByEmail(formData.get('email') as string);
    if (user) {
        return {
            errors: {
                email: ['Email already in use']
            }
        };
    }

    try {
        // Create a new user in the database
        createUser(formData.get('email') as string, formData.get('password') as string);
    } catch (err: unknown) {
        // Handle known and unknown errors during user creation
        if (err instanceof Error) {
            return {
                errors: {
                    _form: [err.message]
                },
            };
        } else {
            return {
                errors: {
                    _form: ['An unknown error occurred']
                }
            };
        }
    }

    // Return an empty error object if the registration was successful
    return {
        errors: {}
    };
}

/**
 * Sign in with Facebook authentication.
 * Redirects to '/my-account' after successful sign-in.
 * @returns Result of the Facebook sign-in attempt.
 */
export async function signInFacebook() {
    return await auth.signIn("facebook", { redirectTo: loginRedirect });
}

/**
 * Sign out the currently authenticated user.
 * @returns The result of the sign-out operation.
 */
export async function signOut() {
    return await auth.signOut();
}

/**
 * Reset the password for a user by sending them a reset link.
 * @param email - The email of the user to reset the password for.
 */
export async function resetPassword(email: string) {
    // TODO: Implement the reset password logic (e.g., send reset link to email)
}

/**
 * Refresh the current user session.
 * Useful when the session needs to be extended or updated.
 */
export async function refreshSession() {
    // TODO: Implement session refresh logic
}
