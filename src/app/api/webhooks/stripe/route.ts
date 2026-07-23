import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Falta la firma de Stripe." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const courseId = session.metadata?.course_id;
    const userId = session.metadata?.user_id;

    if (courseId && userId) {
      const supabase = createAdminClient();
      const amountPaid = (session.amount_total ?? 0) / 100;

      const { error } = await supabase.from("purchases").upsert(
        {
          user_id: userId,
          course_id: courseId,
          amount_paid: amountPaid,
          payment_method: "stripe",
          external_reference: session.id,
        },
        { onConflict: "user_id,course_id" }
      );

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
