import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: ["https://kiwiko.vercel.app", "http://localhost:3000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
  databaseHooks: {
    account: {
      create: {
        before: async (account, context) => {
          if (account.providerId === "github" && context) {
            const session = await auth.api.getSession({
              headers: context.headers as any,
            });

            if (session?.user) {
              // User is already logged in, save to Integration instead of Account
              // @ts-ignore - prisma client might not be generated with integration yet
              await prisma.integration.upsert({
                where: {
                  userId_provider: {
                    userId: session.user.id,
                    provider: "github",
                  },
                },
                update: {
                  accessToken: account.accessToken || "",
                  refreshToken: account.refreshToken,
                  expiresAt: account.accessTokenExpiresAt,
                  updatedAt: new Date(),
                },
                create: {
                  userId: session.user.id,
                  provider: "github",
                  accessToken: account.accessToken || "",
                  refreshToken: account.refreshToken,
                  expiresAt: account.accessTokenExpiresAt,
                },
              });

              // Prevent Account creation by returning false (cancels create)
              return false;
            }
          }
        },
      },
    },
  },
});
