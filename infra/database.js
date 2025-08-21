import { Client } from "pg";

async function query(queryObject) {
  let client = null;
  let result = null;

  try {
    client = await getNewClient();
  } catch (error) {
    console.error("Database connection error:", error);
  }

  try {
    result = await client.query(queryObject);
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
  return result;
}

async function getNewClient() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: handleSSL(),
  });

  await client.connect();
  return client;
}

function handleSSL() {
  return process.env.NODE_ENV === "production" ? true : false;
}

export default {
  query,
  getNewClient,
};
