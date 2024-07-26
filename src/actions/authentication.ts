'use server'

import  * as auth from '@/auth';
import { AuthError } from 'next-auth';
import email from 'next-auth/providers/email';
import { db } from '@/db';
import { User } from '@prisma/client';
import { registrationSchema } from '@/utils/schemas';

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
  const result = registrationSchema.safeParse({ email, password });

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


interface RegisterUserFormState {
  errors: {
      email?: string[];
      password?: string[];
      _form?: string[];
  }

}

export async function test(formState: RegisterUserFormState,
  formData: FormData): Promise<RegisterUserFormState>  {

    const result = registrationSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
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
  try {
    //TODO: Check if slug already exists
    newUser = await db.user.create({
        data: {
          email:formData.get("email") as string,
          password: formData.get("password") as string
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
    
}