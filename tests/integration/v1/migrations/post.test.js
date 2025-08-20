import database from "infra/database";

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

test("POST to /api/v1/migrations should return status 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  const responseBody1 = await response1.json();

  expect(Array.isArray(responseBody1)).toBe(true);
  expect(responseBody1.length).toBeGreaterThan(0);
  expect(response1.status).toBe(201);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  const responseBody2 = await response2.json();

  expect(Array.isArray(responseBody2)).toBe(true);
  expect(responseBody2.length).toBe(0);
  expect(response2.status).toBe(200);
});
