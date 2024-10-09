import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "../env.mjs";
import { user, usersToWorkspaces, workspace } from "./schema";

async function main() {
  const db = drizzle(
    createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN })
  );
  console.log("Seeding database ");
  await db
    .insert(workspace)
    .values([
      {
        id: 2,
        slug: "love-openstatus",
        stripeId: "stripeId1",
        name: "test",
        subscriptionId: "subscriptionId",
        joinCode: "1234565",
        plan: "pro",
        endsAt: null,
        paidUntil: null,
        limits: '{"members":"Unlimited"}',
      },
    ])
    .run();

  await db
    .insert(user)
    .values({
      id: 2,
      name: "Speed Matters",
      email: "ping@openstatus.dev",
      photoUrl: "",
    })
    .run();
  await db
    .insert(usersToWorkspaces)
    .values({ workspaceId: 2, userId: 2 })
    .run();
  process.exit(0);
}

main().catch((e) => {
  console.error("Seed failed");
  console.error(e);
  process.exit(1);
});
