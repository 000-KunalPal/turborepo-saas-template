import type { DefaultSession } from "next-auth";
import NextAuth from "next-auth";

import { db, eq } from "@dashboardbuddy/db";
import { user } from "@dashboardbuddy/db/src/schema";
import { GitHubProvider, GoogleProvider } from "./providers";
import { adapter } from "./adapter";
// import { sendEmail } from "@dashboardbuddy/emails/emails/send";
// import { WelcomeEmail } from "@dashboardbuddy/emails/emails/welcome";

import type { AppProvider } from "next-auth/providers";

export type { DefaultSession };

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [GitHubProvider, GoogleProvider],
  callbacks: {
    async signIn(params) {
      if (params.account?.provider === "google") {
        if (!params.profile) return true;
        if (Number.isNaN(Number(params.user.id))) return true;

        await db
          .update(user)
          .set({
            photoUrl: params.profile.picture,
            name: `${params.profile.given_name} ${params.profile.family_name}`,
          })
          .where(eq(user.id, Number(params.user.id)))
          .run();
      }
      if (params.account?.provider === "github") {
        if (!params.profile) return true;
        if (Number.isNaN(Number(params.user.id))) return true;

        await db
          .update(user)
          .set({
            name: params.profile.name,
            photoUrl: String(params.profile.avatar_url),
          })
          .where(eq(user.id, Number(params.user.id)))
          .run();
      }
      return true;
    },
    async session(params) {
      return params.session;
    },
  },
  // events: {
  //   async createUser(params) {
  //     if (!params.user.id || !params.user.email) {
  //       throw new Error("User id & email is required");
  //     }

  //     await sendEmail({
  //       from: "Kunal Pal <kun931pal@gmail.com>",
  //       subject: "Welcome to dashboardbuddy.",
  //       to: [params.user.email],
  //       react: WelcomeEmail(),
  //     });
  //   },
  // },
  pages: {
    signIn: "/login",
    newUser: "/app/onboarding",
  },
});
