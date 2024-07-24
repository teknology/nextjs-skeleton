'use server'

import * as auth from '@/auth';
import { AuthError } from 'next-auth';
import { registerSchema } from '@/utils/schemas';
import email from 'next-auth/providers/email';
import { db } from '@/db';
import { User } from '@prisma/client';


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
interface RegisterFormState {
  errors: {
      email?: string[];
      password?: string[];
      _form?: string[];
  }
}

export async function signUp(formState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const email = formData.get('email');
  const password = formData.get('password');
  const result = registerSchema.safeParse({ email, password });

  if (!result.success) {
    return {
        errors: result.error.flatten().fieldErrors
    }
  }
  const user = await db.user.findFirst({
      where: {
          email: email as string 
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

  try {
     newUser = await db.user.create({
          data: {
            
              email: email as string,
              password: password as string
          }
      });

      return {
          errors: {}
      }

  } catch (error) {
      return {
          errors: {
              _form: ['Something went wrong']
          }
      }
  }

}
export async function signInFacebook() {
    return await auth.signIn("facebook");
}



export async function signOut() {
    return await auth.signOut();
}


export async function resetPassword(email: string) {

}

export async function test(formState: RegisterFormState,
  formData: FormData): Promise<RegisterFormState>  {

    console.log(formData.get('email'));
  
    
}