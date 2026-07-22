"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createLessonAction(
  sectionId: string,
  courseId: string,
  _formData: FormData
) {
  void _formData;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión para crear una lección.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    throw new Error("No tienes permisos de administrador.");
  }

  const { count } = await supabase
    .from("lessons")
    .select("id", { count: "exact", head: true })
    .eq("section_id", sectionId);

  const { data: newLesson, error } = await supabase
    .from("lessons")
    .insert({
      section_id: sectionId,
      course_id: courseId,
      title: "Nueva lección",
      order_index: count ?? 0,
      blocks: [],
    })
    .select("id")
    .single();

  if (error || !newLesson) {
    throw new Error(error?.message ?? "No se pudo crear la lección.");
  }

  revalidatePath(`/admin/cursos/${courseId}`);
  redirect(`/admin/cursos/${courseId}/lecciones/${newLesson.id}`);
}
