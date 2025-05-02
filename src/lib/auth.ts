import { betterAuth } from "better-auth";
import { Pool } from "pg";
 
export const auth = betterAuth({
    database: new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT === undefined ? undefined
                                              : parseInt(process.env.DB_PORT),
    }),
    emailAndPassword: {
      enabled: true,
    },
})
