const request = require("supertest");
const { setupTestApp, teardownTestApp } = require("./helpers");

describe("GET /api/health", () => {
  let app;
  let memoryServer;

  beforeAll(async () => {
    ({ app, memoryServer } = await setupTestApp());
  });

  afterAll(async () => {
    await teardownTestApp(memoryServer);
  });

  it("returns 200 when the database is connected", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.database).toBe("connected");
  });
});
