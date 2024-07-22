'use server'

import * as auth from '@/auth';
import { AuthError } from 'next-auth';


export async function signInGoogle() {
    return await auth.signIn("google");
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
export async function signInFacebook() {
    return await auth.signIn("facebook");
}
export async function signOut() {
    return await auth.signOut();
}