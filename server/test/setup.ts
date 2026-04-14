import { config } from "dotenv";
import { execSync } from "node:child_process";
import { beforeAll, afterAll, afterEach } from "vitest";

config({ path: ".env.test", override: true });

const { prisma } = await import("../src/lib/prisma.js");

beforeAll(() => {
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env },
  });
});

afterEach(async () => {
  await prisma.resume.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
