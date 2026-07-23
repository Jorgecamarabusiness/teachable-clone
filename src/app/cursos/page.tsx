import { redirect } from "next/navigation";
import { MAIN_COURSE_ID } from "@/lib/courses/mainCourse";

export default function CursosPage() {
  redirect(`/cursos/${MAIN_COURSE_ID}`);
}
