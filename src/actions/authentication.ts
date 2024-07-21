'use server'

import * as auth from '@/auth';


export async function signInGoogle() {
    return await auth.signIn("google");
}
export async function signInFacebook() {
    return await auth.signIn("facebook");
}
export async function signOut() {
    return await auth.signOut();
}