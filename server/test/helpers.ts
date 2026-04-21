import request from "supertest";
import type { Express } from "express";

export interface TestUser {
  email: string;
  password: string;
  token: string;
  userId: string;
}

export const registerUser = async (
  app: Express,
  email: string,
  password = "password123"
): Promise<TestUser> => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ email, password });

  if (res.status !== 201) {
    throw new Error(`registerUser failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return {
    email,
    password,
    token: res.body.data.token,
    userId: res.body.data.user.id,
  };
};

export const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });
