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
  // Resume'lar userId FK ile User'a bağlı, cascade delete için User silmek yeterli
  await prisma.resume.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
