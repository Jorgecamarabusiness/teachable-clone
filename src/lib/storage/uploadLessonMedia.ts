"use client";

import { createClient } from "@/lib/supabase/client";

const BUCKET = "lesson-media";

export async function uploadLessonMedia(
  file: File,
  folder: "videos" | "images"
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();

  const extension = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
