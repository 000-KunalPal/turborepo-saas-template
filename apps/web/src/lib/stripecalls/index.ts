"use server";

import { db, eq } from "@dashboardbuddy/db";
import {
  user,
  usersToWorkspaces,
  workspace,
} from "@dashboardbuddy/db/src/schema";

import { stripe } from "./shared";
import { getPriceIdForPlan } from "./utils";
import { AuthUserWithWorkpace } from "../databasecalls";

const url =
  process.env.NODE_ENV === "production"
    ? "http://localhost:3000"
    : "http://localhost:3000";

// also name as getUserCustomerPortal

export async function createUserCustomerPortal({
  workspaceSlug,
}: {
  workspaceSlug: string;
}) {
  const { USER } = await AuthUserWithWorkpace();
  const result = await db
    .select()
    .from(workspace)
    .where(eq(workspace.slug, workspaceSlug))
    .get();

  if (!result) return;

  const currentUser = db
    .select()
    .from(user)
    .where(eq(user.id, USER.id))
    .as("currentUser");
  const userHasAccess = await db
    .select()
    .from(usersToWorkspaces)
    .where(eq(usersToWorkspaces.workspaceId, result.id))
    .innerJoin(currentUser, eq(usersToWorkspaces.userId, currentUser.id))
    .get();

  if (!userHasAccess || !userHasAccess.users_to_workspaces) return;
  let stripeId = result.stripeId;
  if (!stripeId) {
    const customerData: {
      metadata: { workspaceId: string };
      email?: string;
    } = {
      metadata: {
        workspaceId: String(result.id),
      },
      email: userHasAccess.currentUser.email || "",
    };

    const stripeUser = await stripe.customers.create(customerData);

    stripeId = stripeUser.id;
    await db
      .update(workspace)
      .set({ stripeId })
      .where(eq(workspace.id, result.id))
      .run();
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeId,
    return_url: `${url}/app/${result.slug}/settings`,
  });

  return session.url;
}

// also named as getCheckoutSession
export async function createCheckoutSession({
  workspaceSlug,
  plan,
}: {
  workspaceSlug: string;
  plan: "free" | "starter" | "team" | "pro";
}) {
  const { USER } = await AuthUserWithWorkpace();
  const result = await db
    .select()
    .from(workspace)
    .where(eq(workspace.slug, workspaceSlug))
    .get();
  if (!result) return;
  const currentUser = db
    .select()
    .from(user)
    .where(eq(user.id, USER.id))
    .as("currentUser");
  const userHasAccess = await db
    .select()
    .from(usersToWorkspaces)
    .where(eq(usersToWorkspaces.workspaceId, result.id))
    .innerJoin(currentUser, eq(usersToWorkspaces.userId, currentUser.id))
    .get();
  if (!userHasAccess || !userHasAccess.users_to_workspaces) return;
  let stripeId = result.stripeId;
  if (!stripeId) {
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.id, USER.id))
      .get();
    const customerData: {
      metadata: { workspaceId: string };
      email?: string;
    } = {
      metadata: {
        workspaceId: String(result.id),
      },
      email: currentUser?.email || "",
    };
    const stripeUser = await stripe.customers.create(customerData);
    stripeId = stripeUser.id;
    await db
      .update(workspace)
      .set({ stripeId })
      .where(eq(workspace.id, result.id))
      .run();

    const priceId = getPriceIdForPlan(plan);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: stripeId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${url}/app/${result.slug}/settings/billing?success=true`,
      cancel_url: `${url}/app/${result.slug}/settings/billing`,
    });
    return session;
  }
}
