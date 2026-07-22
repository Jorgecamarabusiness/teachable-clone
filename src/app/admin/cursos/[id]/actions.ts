"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

type ActionResult = {
  error: string | null;
};

export async function createLessonAction(
  sectionId: string,
  courseId: string,
  _formData: FormData
) {
  void _formData;

  const supabase = await createClient();
  const adminCheck = await requireAdmin(supabase);
  if (adminCheck.error) {
    throw new Error(adminCheck.error);
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

type CreateSectionResult =
  | { ok: false; error: string }
  | { ok: true; section: { id: string; title: string } };

export async function createSectionAction(
  courseId: string
): Promise<CreateSectionResult> {
  const supabase = await createClient();
  const adminCheck = await requireAdmin(supabase);
  if (adminCheck.error) return { ok: false, error: adminCheck.error };

  const { count } = await supabase
    .from("sections")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);

  const { data: newSection, error } = await supabase
    .from("sections")
    .insert({
      course_id: courseId,
      title: "Nueva sección",
      order_index: count ?? 0,
    })
    .select("id, title")
    .single();

  if (error || !newSection) {
    return { ok: false, error: error?.message ?? "No se pudo crear la sección." };
  }

  revalidatePath(`/admin/cursos/${courseId}`);
  return { ok: true, section: newSection };
}

export async function updateCourseTitleAction(
  courseId: string,
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
    .from("courses")
    .update({ title: trimmed })
    .eq("id", courseId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/cursos/${courseId}`);
  return { error: null };
}

export async function updateCourseStatusAction(
  courseId: string,
  status: "published" | "draft"
): Promise<ActionResult> {
  const supabase = await createClient();
  const adminCheck = await requireAdmin(supabase);
  if (adminCheck.error) return adminCheck;

  const { error } = await supabase
    .from("courses")
    .update({ status })
    .eq("id", courseId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/cursos/${courseId}`);
  revalidatePath("/cursos");
  return { error: null };
}

export async function updateSectionTitleAction(
  sectionId: string,
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
    .from("sections")
    .update({ title: trimmed })
    .eq("id", sectionId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function reorderSectionsAction(
  courseId: string,
  orderedSectionIds: string[]
): Promise<ActionResult> {
  const supabase = await createClient();
  const adminCheck = await requireAdmin(supabase);
  if (adminCheck.error) return adminCheck;

  const results = await Promise.all(
    orderedSectionIds.map((sectionId, index) =>
      supabase
        .from("sections")
        .update({ order_index: index })
        .eq("id", sectionId)
        .eq("course_id", courseId)
    )
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) {
    return { error: failed.error.message };
  }

  return { error: null };
}

export async function reorderLessonsAction(
  sectionId: string,
  orderedLessonIds: string[]
): Promise<ActionResult> {
  const supabase = await createClient();
  const adminCheck = await requireAdmin(supabase);
  if (adminCheck.error) return adminCheck;

  const results = await Promise.all(
    orderedLessonIds.map((lessonId, index) =>
      supabase
        .from("lessons")
        .update({ order_index: index })
        .eq("id", lessonId)
        .eq("section_id", sectionId)
    )
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) {
    return { error: failed.error.message };
  }

  return { error: null };
}
