import { Client, QueryConfig, QueryResult } from "pg";

export const client: Client = new Client({
  user: ,
  password: ,
  host: ,
  database: ,
  port: ,
});

export const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected!");
};
