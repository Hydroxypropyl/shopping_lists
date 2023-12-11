import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const CONCURRENT_CONNECTIONS = 2;
const databaseUrl = Deno.env.get("DATABASE_URL");
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const connectionPool = new Pool(databaseUrl,
                                 CONCURRENT_CONNECTIONS,
                                  true
                                );

const executeQuery = async (query, params) => {
  const response = {};
  let client;

  try {
    client = await connectionPool.connect();
    const result = await client.queryObject(query, params);
    if (result.rows) {
      response.rows = result.rows;
    }
  } catch (e) {
    response.error = e;
  } finally {
    try {
      await client.release();
    } catch (e) {
      console.log(e);
    }
  }

  return response.rows;
};

export { executeQuery };
