import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@dashboardbuddy/db";
import {
  account,
  session,
  user,
  verificationToken,
} from "@dashboardbuddy/db/src/schema";
import { Adapter } from "next-auth/adapters";
import { createUser, getUser } from "./helpers";

export const adapter: Adapter = {
  ...DrizzleAdapter(db, {
    // @ts-expect-error some issues with types
    usersTable: user,
    // @ts-expect-error some issues with types
    accountsTable: account,
    // @ts-expect-error some issues with types
    sessionsTable: session,
    verificationTokensTable: verificationToken,
  }),
  // @ts-expect-error some issues with types
  createUser: async (data) => {
    return await createUser(data);
  },
  // @ts-expect-error some issues with types
  getUser: async (id) => {
    return await getUser(id);
  },
};
