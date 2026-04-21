import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { registerUser, authHeader } from "./helpers.js";

const app = createApp();

describe("POST /api/auth/register", () => {
  it("geçerli veri 201 döner, token + user döner", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.data.user).toMatchObject({ email: "test@example.com" });
    expect(res.body.data.user.id).toBeTruthy();
    expect(typeof res.body.data.token).toBe("string");
  });

  it("e-postayı küçük harfe çevirir", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "Test@Example.COM", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe("test@example.com");
  });

  it("aynı e-posta ikinci kez → 409", async () => {
    await registerUser(app, "dup@example.com");
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "dup@example.com", password: "password123" });

    expect(res.status).toBe(409);
  });

  it("kısa şifre → 400 validation", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "short@example.com", password: "1234" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
  });

  it("geçersiz email → 400 validation", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "not-an-email", password: "password123" });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("doğru bilgilerle 200 + token döner", async () => {
    await registerUser(app, "login@example.com", "password123");
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe("login@example.com");
    expect(typeof res.body.data.token).toBe("string");
  });

  it("yanlış şifre → 401", async () => {
    await registerUser(app, "wrong@example.com", "correctpass");
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "wrongpass" });

    expect(res.status).toBe(401);
  });

  it("bilinmeyen email → 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "unknown@example.com", password: "password123" });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("geçerli token ile kullanıcıyı döner", async () => {
    const user = await registerUser(app, "me@example.com");
    const res = await request(app).get("/api/auth/me").set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ email: "me@example.com", id: user.userId });
  });

  it("token yoksa 401", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("bozuk token ile 401", async () => {
    const res = await request(app).get("/api/auth/me").set(authHeader("not-a-jwt"));
    expect(res.status).toBe(401);
  });

  it("Bearer prefix yoksa 401", async () => {
    const user = await registerUser(app, "nobear@example.com");
    const res = await request(app).get("/api/auth/me").set("Authorization", user.token);
    expect(res.status).toBe(401);
  });
});
