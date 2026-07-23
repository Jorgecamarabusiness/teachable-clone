"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";
import { getWhopMembershipByLicenseKey, isWhopMembershipValid } from "@/lib/whop/client";

type ActionResult = {
  error: string | null;
};

export async function redeemWhopLicenseAction(
  courseId: string,
  licenseKey: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión para hacer esto." };
  }

  const trimmed = licenseKey.trim();
  if (!trimmed) {
    return { error: "Introduce tu código de licencia de Whop." };
  }

  const membership = await getWhopMembershipByLicenseKey(trimmed);

  if (!membership) {
    return { error: "No se encontró ninguna compra con ese código." };
  }

  if (!isWhopMembershipValid(membership)) {
    return { error: "Este código no es válido para este curso." };
  }

  const { data: course } = await supabase
    .from("courses")
    .select("price")
    .eq("id", courseId)
    .single();

  const admin = createAdminClient();
  const { error } = await admin.from("purchases").insert({
    user_id: user.id,
    course_id: courseId,
    amount_paid: course?.price ?? 0,
    payment_method: "whop",
    external_reference: membership.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Este código ya ha sido utilizado o ya tienes acceso a este curso." };
    }
    return { error: error.message };
  }

  revalidatePath(`/cursos/${courseId}`);
  revalidatePath(`/cursos/${courseId}/aprender`);
  return { error: null };
}

export async function createStripeCheckoutAction(
  courseId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión para comprar el curso." };
  }

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, price")
    .eq("id", courseId)
    .single();

  if (!course) {
    return { error: "Curso no encontrado." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: course.title },
          unit_amount: Math.round(course.price * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/cursos/${courseId}?checkout=success`,
    cancel_url: `${siteUrl}/cursos/${courseId}?checkout=cancelled`,
    client_reference_id: user.id,
    metadata: { course_id: courseId, user_id: user.id },
  });

  if (!session.url) {
    return { error: "No se pudo iniciar el pago con Stripe." };
  }

  redirect(session.url);
}
