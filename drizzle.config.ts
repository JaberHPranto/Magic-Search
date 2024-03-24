import type { Config } from "drizzle-kit";

export default {
  driver: "pg", // progress db
  schema: "./src/db/schema.ts", // type of data
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  out: "./drizzle", // for migration related stuffs
} satisfies Config; // to get type safeties

/*  === Some Commands === 

# push schema to db => npx drizzle-kit push:pg

*/
