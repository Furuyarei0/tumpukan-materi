import { getDevelopmentFixtures } from "./dataAdapter.js";
import { getSupabaseClient } from "../lib/supabase.js";
import { getCourseIdentity } from "./courses.js";
import { mapCourseId, normalizeCourseName } from "../lib/course-catalog.js";
import { filterCourseSearch, normalizeSearchTerm } from "../lib/search.js";

export async function searchCoursesAndMaterials(query, limit = 20) {
  const normalizedQuery = normalizeSearchTerm(query);
  if (!normalizedQuery) return { courses: [], materials: [] };

  const fixtures = await getDevelopmentFixtures();
  if (fixtures) {
    const identity = await getCourseIdentity();
    const courseNameById = new Map(identity.courses.map((course) => [course.id, course.name]));
    const materials = fixtures.materials.map((material) => ({
      ...material,
      courseId: mapCourseId(material.courseId, material.courseName, identity.courseIdAliases, identity.courseIdByName),
      courseName: courseNameById.get(mapCourseId(material.courseId, material.courseName, identity.courseIdAliases, identity.courseIdByName)) ?? "",
    }));
    return filterCourseSearch(identity.courses, materials, normalizedQuery, limit);
  }

  const pattern = `%${normalizedQuery.replace(/[\\%_]/g, "\\$&")}%`;
  const resultLimit = Math.max(0, limit);
  const supabase = getSupabaseClient();
  const [courseResult, materialResult, identity] = await Promise.all([
    supabase
      .from("courses")
      .select("id, code, name, lecturer, credits, semester, class_name, color, sort_order, created_at")
      .ilike("name", pattern)
      .order("sort_order", { ascending: true })
      .limit(resultLimit),
    supabase
      .from("materials")
      .select("id, course_id, title, file_path, file_name, file_size, mime_type, status, submitted_by, created_at, approved_at, course:courses(name)")
      .eq("status", "approved")
      .ilike("title", pattern)
      .order("created_at", { ascending: false })
      .limit(resultLimit),
    getCourseIdentity(),
  ]);
  if (courseResult.error) throw courseResult.error;
  if (materialResult.error) throw materialResult.error;

  const searchedCourses = courseResult.data.map((course) => ({
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
  const searchedCourseNames = new Set(searchedCourses.map((course) => normalizeCourseName(course.name)));
  const courses = identity.courses.filter((course) => (
    searchedCourseNames.has(normalizeCourseName(course.name))
  ));
  const storage = supabase.storage.from("materials");
  const materials = materialResult.data.map((material) => ({
    id: material.id,
    courseId: mapCourseId(material.course_id, material.course?.name, identity.courseIdAliases, identity.courseIdByName),
    courseName: material.course?.name ?? "",
    title: material.title,
    fileName: material.file_name ?? "",
    fileSize: material.file_size,
    mimeType: material.mime_type,
    status: material.status,
    submittedBy: material.submitted_by,
    createdAt: material.created_at,
    approvedAt: material.approved_at,
    url: material.file_path ? storage.getPublicUrl(material.file_path).data.publicUrl : "",
  }));
  return filterCourseSearch(courses, materials, normalizedQuery, limit);
}
