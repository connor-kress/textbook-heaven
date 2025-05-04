import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

export const auth = betterAuth({
    plugins: [nextCookies()], // make sure nextCookies is the last plugin
    database: new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT === undefined ? undefined
                                              : parseInt(process.env.DB_PORT),
    }),
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectURI: process.env.BETTER_AUTH_URL
                     + "/api/auth/callback/google",
      },
    },
})
