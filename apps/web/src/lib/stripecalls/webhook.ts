"use server";
import type Stripe from "stripe";

import { db, eq } from "@dashboardbuddy/db";
import { workspace } from "@dashboardbuddy/db/src/schema";

import { getLimits } from "@dashboardbuddy/db/src/schema/plan/utils";

import { stripe } from "./shared";
import { getPlanFromPriceId } from "./utils";

export async function sessionCompleted({
  event,
}: {
  event: Stripe.CheckoutSessionCompletedEvent;
}) {
  const session = event.data.object as Stripe.Checkout.Session;
  if (typeof session.subscription !== "string") {
    throw new Error("Missing or invalid subscription id");
  }
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription
  );
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const result = await db
    .select()
    .from(workspace)
    .where(eq(workspace.stripeId, customerId))
    .get();
  if (!result) {
    throw new Error("Workspace not found");
  }
  if (!subscription.items.data[0]) {
    throw new Error("Missing or invalid subscription data");
  }
  const plan = getPlanFromPriceId(subscription.items.data[0].price.id);
  if (!plan) {
    console.error("Invalid plan");
    throw new Error("Invalid plan");
  }
  await db
    .update(workspace)
    .set({
      plan: plan.plan,
      subscriptionId: subscription.id,
      endsAt: new Date(subscription.current_period_end * 1000),
      paidUntil: new Date(subscription.current_period_end * 1000),
      limits: JSON.stringify(getLimits(plan.plan)),
    })
    .where(eq(workspace.id, result.id))
    .run();
}

export async function customerSubscriptionDeleted({
  event,
}: {
  event: Stripe.CustomerSubscriptionDeletedEvent;
}) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  await db
    .update(workspace)
    .set({
      subscriptionId: null,
      plan: "free",
      paidUntil: null,
    })
    .where(eq(workspace.stripeId, customerId))
    .run();
}
