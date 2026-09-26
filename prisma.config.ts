import { existsSync } from "node:fs";
import { defineConfig, env } from "prisma/config";

// Vercel injects env vars at build time; locally they come from `vercel env pull`.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations need a direct connection; the pooled URL is for the app at runtime.
    url: env("DATABASE_URL_UNPOOLED"),
  },
});
