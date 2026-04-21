import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { registerUser, authHeader } from "./helpers.js";

const app = createApp();

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  "base64",
);

const createResume = async (token: string) => {
  const res = await request(app)
    .post("/api/resumes")
    .set(authHeader(token))
    .send({ templateId: "classic", content: {} });
  return res.body.data.id as string;
};

describe("POST /api/resumes/:id/photo", () => {
  it("geçerli PNG 200 döner ve photoUrl atanır", async () => {
    const user = await registerUser(app, "photo1@example.com");
    const id = await createResume(user.token);
    const res = await request(app)
      .post(`/api/resumes/${id}/photo`)
      .set(authHeader(user.token))
      .attach("photo", PNG_1X1, { filename: "test.png", contentType: "image/png" });

    expect(res.status).toBe(200);
    expect(res.body.data.photoUrl).toMatch(/^\/uploads\/.+\.png$/);
  });

  it("yanlış mime → 400", async () => {
    const user = await registerUser(app, "photo2@example.com");
    const id = await createResume(user.token);
    const res = await request(app)
      .post(`/api/resumes/${id}/photo`)
      .set(authHeader(user.token))
      .attach("photo", Buffer.from("hello"), {
        filename: "test.txt",
        contentType: "text/plain",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/JPG, PNG, WebP/);
  });

  it("yanlış field adı → 400 (UploadError)", async () => {
    const user = await registerUser(app, "photo3@example.com");
    const id = await createResume(user.token);
    const res = await request(app)
      .post(`/api/resumes/${id}/photo`)
      .set(authHeader(user.token))
      .attach("image", PNG_1X1, { filename: "test.png", contentType: "image/png" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("UploadError");
  });

  it("dosya yok → 400", async () => {
    const user = await registerUser(app, "photo4@example.com");
    const id = await createResume(user.token);
    const res = await request(app)
      .post(`/api/resumes/${id}/photo`)
      .set(authHeader(user.token));

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Dosya yüklenmedi/);
  });
});
