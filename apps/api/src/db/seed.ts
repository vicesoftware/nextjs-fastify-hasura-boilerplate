import { db } from "./index.js";
import { appMetadata } from "./schema.js";

export async function seedDatabase() {
  try {
    console.log("Seeding database with initial data...");

    // Insert initial app metadata
    await db
      .insert(appMetadata)
      .values([
        {
          component: "api",
          version: "1.0.0",
          gitCommit: "initial",
          environment: "production",
        },
        {
          component: "web",
          version: "1.0.0",
          gitCommit: "initial",
          environment: "production",
        },
        {
          component: "hasura",
          version: "2.0.0",
          gitCommit: "initial",
          environment: "production",
        },
      ])
      .onConflictDoNothing();

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
