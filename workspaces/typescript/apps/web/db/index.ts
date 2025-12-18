import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const getDb = () => {
    const sql = neon(process.env.METROHAIL_DB_URI!);
    return drizzle(sql, { schema });
};

export const db = new Proxy({} as ReturnType<typeof getDb>, {
    get(_, prop) {
        return getDb()[prop as keyof ReturnType<typeof getDb>];
    },
});
