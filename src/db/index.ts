import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema"
import * as relations from "./relations"

export const db = drizzle({ 
  schema: { ...schema, ...relations },
  connection: { 
    user: process.env.DB_USER!,
    host: process.env.DB_HOST!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD!,
    port: process.env.DB_PORT === undefined
      ? undefined
      : parseInt(process.env.DB_PORT),
    ssl: false, // TODO: true in production
  },
});
