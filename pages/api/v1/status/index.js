import database from "infra/database";

async function status(req, res) {
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const databaseName = process.env.POSTGRES_DB;

  const usedConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseVersionValue = databaseVersionResult.rows[0].server_version;
  const maxConnectionsValue = maxConnectionsResult.rows[0].max_connections;
  const usedConnectionsValue = usedConnectionsResult.rows[0].count;

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        server_version: databaseVersionValue,
        max_connections: parseInt(maxConnectionsValue),
        used_connections: usedConnectionsValue,
      },
    },
  });
}

export default status;
