import "dotenv/config";
import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.DB_USER!,
    host: process.env.DB_HOST!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD!,
    port: process.env.DB_PORT === undefined
      ? undefined
      : parseInt(process.env.DB_PORT),
    ssl: false,
  },
});
