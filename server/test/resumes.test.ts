import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { registerUser, authHeader } from "./helpers.js";

const app = createApp();

const sampleBody = {
  templateId: "modern",
  theme: { primaryColor: "#0ea5e9" },
  content: { basics: { name: "Test", email: "t@example.com" } },
};

describe("Auth guard (Bearer JWT)", () => {
  it("header yoksa 401 döner", async () => {
    const res = await request(app).get("/api/resumes");
    expect(res.status).toBe(401);
  });

  it("bozuk token 401 döner", async () => {
    const res = await request(app).get("/api/resumes").set(authHeader("bad"));
    expect(res.status).toBe(401);
  });

  it("geçerli token boş liste döner", async () => {
    const user = await registerUser(app, "a@example.com");
    const res = await request(app).get("/api/resumes").set(authHeader(user.token));
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [] });
  });
});

describe("POST /api/resumes", () => {
  it("geçerli body 201 döner", async () => {
    const user = await registerUser(app, "post@example.com");
    const res = await request(app)
      .post("/api/resumes")
      .set(authHeader(user.token))
      .send(sampleBody);

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      userId: user.userId,
      templateId: "modern",
      content: sampleBody.content,
    });
    expect(res.body.data.id).toBeTruthy();
  });

  it("boş templateId validation hatası verir", async () => {
    const user = await registerUser(app, "valid@example.com");
    const res = await request(app)
      .post("/api/resumes")
      .set(authHeader(user.token))
      .send({ templateId: "", content: {} });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
    expect(res.body.details.templateId).toBeTruthy();
  });

  it("templateId default 'classic'", async () => {
    const user = await registerUser(app, "def@example.com");
    const res = await request(app)
      .post("/api/resumes")
      .set(authHeader(user.token))
      .send({ content: { basics: {} } });

    expect(res.status).toBe(201);
    expect(res.body.data.templateId).toBe("classic");
  });
});

describe("GET /api/resumes", () => {
  it("sadece kullanıcının resume'larını döner", async () => {
    const userA = await registerUser(app, "listA@example.com");
    const userB = await registerUser(app, "listB@example.com");

    await request(app).post("/api/resumes").set(authHeader(userA.token)).send(sampleBody);
    await request(app).post("/api/resumes").set(authHeader(userA.token)).send(sampleBody);
    await request(app).post("/api/resumes").set(authHeader(userB.token)).send(sampleBody);

    const a = await request(app).get("/api/resumes").set(authHeader(userA.token));
    const b = await request(app).get("/api/resumes").set(authHeader(userB.token));

    expect(a.body.data).toHaveLength(2);
    expect(b.body.data).toHaveLength(1);
  });
});

describe("GET /api/resumes/:id", () => {
  it("kendi resume'unu döner", async () => {
    const user = await registerUser(app, "geta@example.com");
    const created = await request(app)
      .post("/api/resumes")
      .set(authHeader(user.token))
      .send(sampleBody);
    const id = created.body.data.id;

    const res = await request(app).get(`/api/resumes/${id}`).set(authHeader(user.token));
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it("başkasının resume'una 403 döner", async () => {
    const userA = await registerUser(app, "forbida@example.com");
    const userB = await registerUser(app, "forbidb@example.com");

    const created = await request(app)
      .post("/api/resumes")
      .set(authHeader(userA.token))
      .send(sampleBody);
    const id = created.body.data.id;

    const res = await request(app).get(`/api/resumes/${id}`).set(authHeader(userB.token));
    expect(res.status).toBe(403);
  });

  it("yok ise 404 döner", async () => {
    const user = await registerUser(app, "notfound@example.com");
    const res = await request(app)
      .get("/api/resumes/cm0000000000000000000000z")
      .set(authHeader(user.token));
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/resumes/:id", () => {
  it("templateId günceller", async () => {
    const user = await registerUser(app, "puta@example.com");
    const created = await request(app)
      .post("/api/resumes")
      .set(authHeader(user.token))
      .send(sampleBody);
    const id = created.body.data.id;

    const res = await request(app)
      .put(`/api/resumes/${id}`)
      .set(authHeader(user.token))
      .send({ templateId: "creative" });

    expect(res.status).toBe(200);
    expect(res.body.data.templateId).toBe("creative");
  });

  it("başkasının resume'unu güncelleyemez", async () => {
    const userA = await registerUser(app, "puta2@example.com");
    const userB = await registerUser(app, "putb@example.com");

    const created = await request(app)
      .post("/api/resumes")
      .set(authHeader(userA.token))
      .send(sampleBody);
    const id = created.body.data.id;

    const res = await request(app)
      .put(`/api/resumes/${id}`)
      .set(authHeader(userB.token))
      .send({ templateId: "creative" });
    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/resumes/:id", () => {
  it("siler ve sonrasında 404 döner", async () => {
    const user = await registerUser(app, "dela@example.com");
    const created = await request(app)
      .post("/api/resumes")
      .set(authHeader(user.token))
      .send(sampleBody);
    const id = created.body.data.id;

    const del = await request(app).delete(`/api/resumes/${id}`).set(authHeader(user.token));
    expect(del.status).toBe(204);

    const get = await request(app).get(`/api/resumes/${id}`).set(authHeader(user.token));
    expect(get.status).toBe(404);
  });

  it("başkasının resume'unu silemez", async () => {
    const userA = await registerUser(app, "dela2@example.com");
    const userB = await registerUser(app, "delb@example.com");

    const created = await request(app)
      .post("/api/resumes")
      .set(authHeader(userA.token))
      .send(sampleBody);
    const id = created.body.data.id;

    const res = await request(app).delete(`/api/resumes/${id}`).set(authHeader(userB.token));
    expect(res.status).toBe(403);
  });
});
