import database from "infra/database";

async function status(req, res) {
  const result = await database.query("select 1+1 as sum");
  console.log(result.rows[0]);
  res.status(200).json({
    status: "Ok",
    timestamp: new Date().toISOString(),
  });
}

export default status;
