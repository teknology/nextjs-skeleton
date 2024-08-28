
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/db"
import { comparePasswords } from "./utils/auth"
import { z } from 'zod';
import { getUserByEmail, User } from "./db/queries/user"
import { redirect } from "next/dist/server/api-utils"

interface UserCredentials {
  email: string;
  password: string | null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
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
      authorize: async (credentials): Promise<UserCredentials | null> => {
        let user = null

        if (!credentials.email) {

          throw new Error("Email missing")
        }
        if (!credentials.password) {
          throw new Error("Password missing")
        }

        if (credentials.email && credentials.password) {
          const email = credentials.email as string;
          const password = credentials.password as string;
          const user = await getUserByEmail(email);

          // console.log(user);
          // console.log('user password', user?.password);


          // Add code to check if Password is null. If it is, then redirect to the password reset page
          try {
            const passwordsMatch = await comparePasswords(password as string, user?.password as string);

            //  console.log(passwordsMatch);

            if (passwordsMatch) return user;
            // console.log(user);
            // return user;

          }
          catch (error) {
            console.error('Failed to compare passwords:', error);
            //  throw new Error('Failed to compare passwords.');

            return null; // Fix: Return null instead of error
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Add your logic here and return a boolean or string
      return true; // or return a URL string to redirect
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },

    jwt({ token, trigger, session, user }) {
      if (trigger === "update" && session) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.picture = session.image
        //console.log('session image', token);
      }
      try {
        if (user) {
          token.id = user.id
        }
      }
      catch (error) {
        console.log(error)
      }
      return token
    },
    session({ session, token }: any) {
      session.user.id = token.id
      return session
    },
  },


})
