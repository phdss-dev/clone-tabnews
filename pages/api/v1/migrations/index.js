import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(req, res) {
  let dbClient;
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: `Method "${req.method}" not allowed.`,
    });
  }

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsSettings = {
      dbClient,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    const runMigrations = async (dryRun = false) => {
      return migrationRunner({
        ...defaultMigrationsSettings,
        dryRun,
      });
    };

    if (req.method === "GET") {
      const pendingMigrations = await runMigrations(true);
      return res.status(200).json(pendingMigrations);
    } else if (req.method === "POST") {
      const executedMigrations = await runMigrations(false);
      const status = executedMigrations.length > 0 ? 201 : 200;
      console.log(executedMigrations);
      return res.status(status).json(executedMigrations);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (dbClient) await dbClient.end();
  }
}
