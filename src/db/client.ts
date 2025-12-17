import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

function createThrowingProxy() {
  return new Proxy(
    {},
    {
      get() {
        throw new Error("DATABASE_URL is not configured. DB operations are disabled.");
      },
    }
  ) as any;
}

export const db = connectionString
  ? drizzle(new Pool({ connectionString }), { schema })
  : createThrowingProxy();










