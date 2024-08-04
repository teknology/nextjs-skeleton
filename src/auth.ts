import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/db"
import { comparePasswords } from "./utils/auth"
import { z } from 'zod';
import { getUserByEmail } from "./db/queries/user"
import { redirect } from "next/dist/server/api-utils"


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
      authorize: async (credentials) => {



        if (!credentials.email) {

          throw new Error("Email missing")
        }
        let user = null


        if (credentials) {
          const email = credentials.email as string;
          const password = credentials.password as string;
          const user = await getUserByEmail(email);
          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.")
          }
          const passwordsMatch = await comparePasswords(password as string, user.password as string);

          if (passwordsMatch) return user;

          console.log(user);
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },

    jwt({ token, user }) {
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