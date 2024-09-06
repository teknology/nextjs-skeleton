
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/db"
import { comparePasswords } from "./utils/auth"
import { getUserByEmail } from "./db/queries/user"
import { getThemeInDb } from "./db/queries/appearance"
import { saveProviderAccount } from "./db/queries/provider"


interface UserCredentials {
  email: string;
  password: string | null;
}
declare module 'next-auth' {

  interface User {

    // other properties

    theme?: string | '';

  }

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
        // let user = null

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

          // Add code to check if Password is null. If it is, then redirect to the password reset page
          try {
            const passwordsMatch = await comparePasswords(password as string, user?.password as string);

            if (passwordsMatch) return user;
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
      if (account?.provider) {

        console.log("Account Provider: ", account)
        // Save provider account data to ProviderAccount table
        await saveProviderAccount(user.id as string, account);
      }
      return true;
    },


    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },

    async jwt({ token, trigger, session, user }) {

      if (trigger === "update" && session) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.picture = session.image
      }

      try {
        if (user) {
          token.id = user.id
          if ('emailVerified' in user) {
            token.emailVerified = user.emailVerified;
          }
          if (!token.theme) {
            const userTheme = await getThemeInDb(user.id as string)
            token.theme = userTheme
          }

        }
      }
      catch (error) {
        console.log(error)
      }
      return token
    },
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.emailVerified = token.emailVerified;
      session.user.theme = token.theme;


      return session;
    },
  },

})
