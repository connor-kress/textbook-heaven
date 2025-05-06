import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({ 
  connection: { 
    user: process.env.DB_USER!,
    host: process.env.DB_HOST!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD!,
    port: process.env.DB_PORT === undefined
      ? undefined
      : parseInt(process.env.DB_PORT),
    ssl: false, // TODO: true in production
  }
});
