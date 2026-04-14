import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();
const UUID_A = "00000000-0000-4000-8000-00000000000a";
const UUID_B = "00000000-0000-4000-8000-00000000000b";

const sampleBody = {
  templateId: "modern",
  theme: { primaryColor: "#0ea5e9" },
  content: { basics: { name: "Test", email: "t@example.com" } },
};

const create = (uuid = UUID_A, body: object = sampleBody) =>
  request(app).post("/api/resumes").set("X-Owner-Uuid", uuid).send(body);

describe("Auth (X-Owner-Uuid)", () => {
  it("header yoksa 400 döner", async () => {
    const res = await request(app).get("/api/resumes");
    expect(res.status).toBe(400);
  });

  it("geçersiz UUID formatı 400 döner", async () => {
    const res = await request(app).get("/api/resumes").set("X-Owner-Uuid", "not-a-uuid");
    expect(res.status).toBe(400);
  });

  it("geçerli UUID boş liste döner", async () => {
    const res = await request(app).get("/api/resumes").set("X-Owner-Uuid", UUID_A);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [] });
  });
});

describe("POST /api/resumes", () => {
  it("geçerli body 201 döner", async () => {
    const res = await create();
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      ownerUuid: UUID_A,
      templateId: "modern",
      content: sampleBody.content,
    });
    expect(res.body.data.id).toBeTruthy();
  });

  it("boş templateId validation hatası verir", async () => {
    const res = await create(UUID_A, { templateId: "", content: {} });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
    expect(res.body.details.templateId).toBeTruthy();
  });

  it("templateId default 'classic'", async () => {
    const res = await create(UUID_A, { content: { basics: {} } });
    expect(res.status).toBe(201);
    expect(res.body.data.templateId).toBe("classic");
  });
});

describe("GET /api/resumes", () => {
  it("sadece owner'ın resume'larını döner", async () => {
    await create(UUID_A);
    await create(UUID_A);
    await create(UUID_B);

    const a = await request(app).get("/api/resumes").set("X-Owner-Uuid", UUID_A);
    const b = await request(app).get("/api/resumes").set("X-Owner-Uuid", UUID_B);

    expect(a.body.data).toHaveLength(2);
    expect(b.body.data).toHaveLength(1);
  });
});

describe("GET /api/resumes/:id", () => {
  it("kendi resume'unu döner", async () => {
    const created = await create();
    const id = created.body.data.id;
    const res = await request(app).get(`/api/resumes/${id}`).set("X-Owner-Uuid", UUID_A);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it("başkasının resume'una 403 döner", async () => {
    const created = await create(UUID_A);
    const id = created.body.data.id;
    const res = await request(app).get(`/api/resumes/${id}`).set("X-Owner-Uuid", UUID_B);
    expect(res.status).toBe(403);
  });

  it("yok ise 404 döner", async () => {
    const res = await request(app)
      .get("/api/resumes/cm0000000000000000000000z")
      .set("X-Owner-Uuid", UUID_A);
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/resumes/:id", () => {
  it("templateId günceller", async () => {
    const created = await create();
    const id = created.body.data.id;
    const res = await request(app)
      .put(`/api/resumes/${id}`)
      .set("X-Owner-Uuid", UUID_A)
      .send({ templateId: "creative" });
    expect(res.status).toBe(200);
    expect(res.body.data.templateId).toBe("creative");
  });

  it("başkasının resume'unu güncelleyemez", async () => {
    const created = await create(UUID_A);
    const id = created.body.data.id;
    const res = await request(app)
      .put(`/api/resumes/${id}`)
      .set("X-Owner-Uuid", UUID_B)
      .send({ templateId: "creative" });
    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/resumes/:id", () => {
  it("siler ve sonrasında 404 döner", async () => {
    const created = await create();
    const id = created.body.data.id;

    const del = await request(app).delete(`/api/resumes/${id}`).set("X-Owner-Uuid", UUID_A);
    expect(del.status).toBe(204);

    const get = await request(app).get(`/api/resumes/${id}`).set("X-Owner-Uuid", UUID_A);
    expect(get.status).toBe(404);
  });

  it("başkasının resume'unu silemez", async () => {
    const created = await create(UUID_A);
    const id = created.body.data.id;
    const res = await request(app).delete(`/api/resumes/${id}`).set("X-Owner-Uuid", UUID_B);
    expect(res.status).toBe(403);
  });
});
