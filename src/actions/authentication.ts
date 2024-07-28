'use server'

import * as auth from '@/auth';
import { AuthError } from 'next-auth';
import { db } from '@/db';
import { User } from '@prisma/client';
import { registrationSchema } from '@/utils/schemas';
import { saltAndHashPassword } from '@/utils/auth';
const loginRedirect = '/dashboard';
export async function signInGoogle() {
    return await auth.signIn("google", { redirectTo: loginRedirect });
}

// Credentials Signin
export async function signInPassword(
    prevState: string | undefined,
    formData: FormData,) {

    try {
        await auth.signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
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
    const user = await db.user.findFirst({
        where: {
            email: formData.get("email") as string
        }
    });
    if (user) {
        return {
            errors: {
                email: ['Email already in use']
            }
        }
    }

    let newUser: User;
    const hashedPassword = await saltAndHashPassword(formData.get("password") as string);
    try {
        //TODO: Check if slug already exists
        newUser = await db.user.create({
            data: {
                email: formData.get("email") as string,
                password: hashedPassword
            }
        })

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
