import { Client } from "pg";

async function query(queryObject) {
  let client = null;
  if (process.env.NODE_ENV === "development") {
    client = new Client({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
    });
  } else {
    client = new Client({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
      ssl: {
        rejectUnauthorized: true,
        ca: Buffer.from(process.env.POSTGRES_SSL_CA, "base64").toString(
          "utf-8",
        ),
      },
    });
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
