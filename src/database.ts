import { Client, QueryConfig, QueryResult } from "pg";

export const client: Client = new Client({
  user: "Estudo Kenzie",
  password: "1234",
  host: "localhost",
  database: "movies",
  port: 5432,
});

export const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected!");
};
