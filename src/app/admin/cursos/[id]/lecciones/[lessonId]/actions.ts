"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ContentBlock } from "@/types";

type ActionResult = {
  error: string | null;
};

async function requireAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<ActionResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión para editar esta lección." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return { error: "No tienes permisos de administrador." };
  }

  return { error: null };
}

export async function updateLessonBlocksAction(
  lessonId: string,
  blocks: ContentBlock[]
): Promise<ActionResult> {
  const supabase = await createClient();

  const adminCheck = await requireAdmin(supabase);
  if (adminCheck.error) return adminCheck;

  const { error } = await supabase
    .from("lessons")
    .update({ blocks })
    .eq("id", lessonId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function updateLessonTitleAction(
  lessonId: string,
  title: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const adminCheck = await requireAdmin(supabase);
  if (adminCheck.error) return adminCheck;

  const trimmed = title.trim();
  if (!trimmed) {
    return { error: "El título no puede estar vacío." };
  }

  const { error } = await supabase
    .from("lessons")
    .update({ title: trimmed })
    .eq("id", lessonId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function deleteLessonAction(
  lessonId: string,
  courseId: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const adminCheck = await requireAdmin(supabase);
  if (adminCheck.error) return adminCheck;

  const { error } = await supabase.from("lessons").delete().eq("id", lessonId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/cursos/${courseId}`);
  redirect(`/admin/cursos/${courseId}`);
}
