import { getDevelopmentFixtures } from "./dataAdapter.js";
import { getSupabaseClient } from "../lib/supabase.js";
import { createCourseCatalog } from "../lib/course-catalog.js";

export async function getCourses() {
  const fixtures = await getDevelopmentFixtures();
  if (fixtures) return createCourseCatalog(fixtures.courses).courses;

  const { data, error } = await getSupabaseClient()
    .from("courses")
    .select("id, code, name, lecturer, credits, semester, class_name, color, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;

  const courses = data.map((course) => ({
    id: course.id,
    code: course.code ?? "",
    name: course.name,
    lecturer: course.lecturer ?? "",
    credits: course.credits,
    semester: course.semester,
    className: course.class_name,
    color: course.color ?? "sage",
    sortOrder: course.sort_order,
    createdAt: course.created_at,
  }));
  return createCourseCatalog(courses).courses;
}

export async function getCourseIdentity() {
  const fixtures = await getDevelopmentFixtures();
  if (fixtures) return createCourseCatalog(fixtures.courses);

  const { data, error } = await getSupabaseClient()
    .from("courses")
    .select("id, name, created_at")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;
  return createCourseCatalog(data.map((course) => ({
    id: course.id,
    name: course.name,
    createdAt: course.created_at,
  })));
}
