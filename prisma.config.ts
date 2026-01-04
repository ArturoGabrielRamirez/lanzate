import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma 7 uses url for the pooled connection
    url: process.env["PRISMA_DIRECT_URL"],
    // shadowDatabaseUrl can be used for direct connections during migrations
    //shadowDatabaseUrl: process.env["PRISMA_DIRECT_URL"],
  }
});
