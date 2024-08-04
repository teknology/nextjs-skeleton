'use server'

import * as auth from '@/auth';
import { AuthError } from 'next-auth';
import { db } from '@/db';
import { User } from '@prisma/client';
import { loginSchema, registrationSchema } from '@/utils/schemas';
import { saltAndHashPassword } from '@/utils/auth';
import { createUser, getUserByEmail } from '@/db/queries/user';
import email from 'next-auth/providers/email';
import { SignInPasswordFormState } from '@/utils/types';
import { permanentRedirect, redirect } from 'next/navigation';


const loginRedirect = '/my-account';
export async function signInGoogle() {
    return await auth.signIn("google", { redirectTo: loginRedirect });
}


// Credentials Signin
export async function signInPassword(
    formState: SignInPasswordFormState,
    formData: FormData
): Promise<SignInPasswordFormState> {

    const result = await loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    });

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    try {
        console.log(formData.get('email'));
        const result = await auth.signIn('credentials', {
            redirectTo: loginRedirect,
            email: formData.get('email') as string,
            password: formData.get('password') as string,

        });

    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
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
function findUserByEmail(arg0: string) {
    throw new Error('Function not implemented.');
}

