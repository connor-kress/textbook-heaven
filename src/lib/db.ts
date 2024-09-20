import { Pool } from "pg";

console.log(`Adding database host: ${process.env.DB_HOST}`);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT === undefined ? undefined
                                          : parseInt(process.env.DB_PORT),
});

export default pool;
