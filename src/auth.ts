
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/db"
import { comparePasswords } from "./utils/auth"
import { getUserByEmail } from "./db/queries/user"
import { getThemeInDb } from "./db/queries/appearance"
import { CustomProviderAccountAdapter } from "./lib/custom-auth-adapter"


interface UserCredentials {
  id: string;
  email: string;
  password: string | null;
  emailVerified: string | null;
  theme?: string;
}
declare module 'next-auth' {

  interface User {

    // other properties

    theme?: string | '';

  }

}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: CustomProviderAccountAdapter(),
  session: { strategy: "jwt" },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Facebook,
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>>): Promise<UserCredentials | null> {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and password are required.");
        }

        const user = await getUserByEmail(credentials.email as string);

        if (!user?.password) {
          return null;
        }

        if (!(await comparePasswords(credentials.password as string, user.password))) {
          return null;
        }

        return {
          id: user.id,
          email: user.profile?.email ?? "",
          password: null,
          emailVerified: user.profile?.emailVerified ? String(user.profile.emailVerified) : null,
          theme: user.profile?.theme ?? "light",
        };
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
          if (!token.locale) {
            const userLocale = await getLocaleByUser()
            token.locale = userLocale
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
      session.user.locale = token.locale;


      return session;
    },
  },

})
