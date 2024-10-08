import type { NextRequest } from "next/server";

import { stripe } from "@/lib/stripecalls/shared";

import { env } from "@/env";
import {
  customerSubscriptionDeleted,
  sessionCompleted,
} from "@/lib/stripecalls/webhook";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("Stripe-Signature");
  if (!signature) return new Response("No signature", { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET_KEY
    );

    switch (event.type) {
      case "checkout.session.completed":
        await sessionCompleted({ event });
        break;

      case "customer.subscription.deleted":
        await customerSubscriptionDeleted({
          event,
        });
        break;

      default:
        throw new Error(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Webhook Error: ${message}`, {
      status: 400,
    });
  }

  return new Response(null, { status: 200 });
}
