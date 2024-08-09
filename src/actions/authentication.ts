'use server'

import * as auth from '@/auth';
import { loginSchema, registrationSchema } from '@/utils/schemas';
import { createUser, getUserByEmail } from '@/db/queries/user';
import { SignInPasswordFormState } from '@/utils/types/types';

const loginRedirect = '/my-account';
export async function signInGoogle() {
    return await auth.signIn("google", { redirectTo: loginRedirect });
}


// Credentials Signin
export async function signInPassword(
    formState: SignInPasswordFormState,
    formData: FormData
): Promise<SignInPasswordFormState> {

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const result = await loginSchema.safeParse({
        email: email,
        password: password
    });
    const user = await getUserByEmail(email);
    if (!user) {
        return {
            errors: {
                email: ['User not found']
            }
        }
    }
    if (!user.password || user.password === '' || user.password === null) {
        return {
            errors: {
                password: ['Password not set. Please reset your password']
            }
        }
    }
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    try {
        // console.log(formData.get('email'));
        const result = await auth.signIn('credentials', {
            redirectTo: loginRedirect,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            user: user

        });

    } catch (error) {
        if (error instanceof Error) {
            //  console.log(error.message);
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
            }
        }
    }


    return {
        errors: {}
    }



}


interface RegisterUserFormState {
    errors: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        //TODO: Add agreeTerms check box validation  
        //   agreeTerms?: string[];
        _form?: string[];
    }
}
export async function signUpPassword(formState: RegisterUserFormState,
    formData: FormData): Promise<RegisterUserFormState> {

    const result = registrationSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        //TODO: Add agreeTerms check box validation
        // agreeTerms: formData.get('agreeTerms')
    });

    if (!result.success) {
        // console.log(result.error.flatten().fieldErrors);
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    const user = await getUserByEmail(formData.get('email') as string);

    if (user) {
        return {
            errors: {
                email: ['Email already in use']
            }
        }
    }


    try {
        //TODO: Check if slug already exists
        createUser(formData.get('email') as string, formData.get('password') as string);

    } catch (err: unknown) {
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
            }
        }

    }
    return {
        errors: {}
    }

}
export async function signInFacebook() {
    return await auth.signIn("facebook", { redirectTo: loginRedirect });
}



export async function signOut() {
    return await auth.signOut();
}


export async function resetPassword(email: string) {


}

