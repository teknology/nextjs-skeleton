import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/db"
import { comparePasswords, saltAndHashPassword } from "./utils/auth"
import { z } from 'zod';
import { getUserByEmail } from "./db/queries/users"


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Facebook,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);


        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);
          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.")
          }
          const passwordsMatch = await comparePasswords(password, user.password as string);

          if (passwordsMatch) return user;
        }

        return null;

        /*
        // logic to salt and hash password
        const pwHash = saltAndHashPassword(credentials.password)
 
        // logic to verify if user exists
        user = await getUserFromDb(credentials.email, pwHash)
 
        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.")
        }
 
        // return user object with the their profile data
        return user
        */
      },
    }),
  ],


})