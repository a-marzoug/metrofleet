import postgres from "postgres";

const getConnectionString = (): string =>
  process.env.DATABASE_URL ||
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}`;

const sql = postgres(getConnectionString());

export default sql;
