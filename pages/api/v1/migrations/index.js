import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(req, res) {
  const dbClient = await database.getNewClient();

  const defaultMigrationsSettings = {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (req.method === "GET") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsSettings,
      dryRun: true,
    });

    dbClient.end();

    return res.status(200).json(pendingMigrations);
  } else if (req.method === "POST") {
    const executedMigrations = await migrationRunner({
      ...defaultMigrationsSettings,
    });

    dbClient.end();

    if (executedMigrations.length > 0) {
      return res.status(201).json(executedMigrations);
    }

    return res.status(200).json(executedMigrations);
  }

  res.status(405).end();
}
