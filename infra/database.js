import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });

  const ssl = process.env.NODE_ENV === "production" && {
    rejectUnauthorized: true,
    ca: Buffer.from(process.env.POSTGRES_SSL_CA, "base64").toString("utf-8"),
  };

  if (ssl) {
    client.ssl = ssl;
  }

  let result = null;

  try {
    await client.connect();
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

export default {
  query,
};
