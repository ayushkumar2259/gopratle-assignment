const request = require("supertest");
const {
  setupTestApp,
  teardownTestApp,
  validPlannerPayload,
  validPerformerPayload,
  validCrewPayload,
} = require("./helpers");

describe("Requirements API", () => {
  let app;
  let memoryServer;

  beforeAll(async () => {
    ({ app, memoryServer } = await setupTestApp());
  });

  afterAll(async () => {
    await teardownTestApp(memoryServer);
  });

  it("creates a planner requirement", async () => {
    const response = await request(app).post("/api/requirements").send(validPlannerPayload());

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.category).toBe("planner");
    expect(response.body.data.plannerDetails.expectedAttendees).toBe(180);
    expect(response.body.data.performerDetails).toBeUndefined();
    expect(response.body.data.status).toBe("submitted");
  });

  it("creates a performer requirement", async () => {
    const response = await request(app).post("/api/requirements").send(validPerformerPayload());

    expect(response.status).toBe(201);
    expect(response.body.data.category).toBe("performer");
    expect(response.body.data.performerDetails.performerType).toBe("Band");
  });

  it("creates a crew requirement", async () => {
    const response = await request(app).post("/api/requirements").send(validCrewPayload());

    expect(response.status).toBe(201);
    expect(response.body.data.category).toBe("crew");
    expect(response.body.data.crewDetails.requiredRoles).toEqual(["Lighting", "Sound"]);
  });

  it("rejects missing required fields", async () => {
    const response = await request(app).post("/api/requirements").send({
      eventName: "AB",
      category: "planner",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  it("rejects an end date before the start date", async () => {
    const response = await request(app)
      .post("/api/requirements")
      .send(validPlannerPayload({ startDate: "2026-12-12", endDate: "2026-12-10" }));

    expect(response.status).toBe(400);
    expect(response.body.errors.some((error) => error.field === "endDate")).toBe(true);
  });

  it("rejects a planner payload that also includes performer details", async () => {
    const response = await request(app)
      .post("/api/requirements")
      .send({
        ...validPlannerPayload(),
        performerDetails: {
          performerType: "DJ",
          genre: "Pop",
          performerCount: 1,
          performanceDuration: "60 minutes",
          budget: 10000,
          equipment: "Self-equipped",
          preferredLanguage: "Hindi",
        },
      });

    expect(response.status).toBe(400);
  });

  it("rejects invalid numeric values", async () => {
    const response = await request(app)
      .post("/api/requirements")
      .send(
        validPlannerPayload({
          plannerDetails: {
            expectedAttendees: -4,
            budget: 1000,
            requiredServices: ["Decor"],
            experience: "3-5 years",
            numberOfPlanners: 1,
          },
        })
      );

    expect(response.status).toBe(400);
    expect(response.body.errors.some((error) => error.field.includes("expectedAttendees"))).toBe(true);
  });

  it("returns a saved requirement by id", async () => {
    const created = await request(app).post("/api/requirements").send(validCrewPayload());
    const id = created.body.data._id;

    const response = await request(app).get(`/api/requirements/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(id);
    expect(response.body.data.eventName).toBe("Product Launch");
  });

  it("returns 400 for a malformed id", async () => {
    const response = await request(app).get("/api/requirements/not-an-id");
    expect(response.status).toBe(400);
  });

  it("returns 404 for a missing requirement", async () => {
    const response = await request(app).get("/api/requirements/aaaaaaaaaaaaaaaaaaaaaaaa");
    expect(response.status).toBe(404);
  });

  it("returns 404 for unknown routes", async () => {
    const response = await request(app).get("/api/unknown");
    expect(response.status).toBe(404);
  });
});
