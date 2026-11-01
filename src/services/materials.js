import { getDevelopmentFixtures } from "./dataAdapter.js";
import { getSupabaseClient } from "../lib/supabase.js";
import { getCourseIdentity } from "./courses.js";
import { mapCourseId } from "../lib/course-catalog.js";

export async function getMaterials(courseId) {
  const fixtures = await getDevelopmentFixtures();
  if (fixtures) {
    const identity = await getCourseIdentity();
    const materials = fixtures.materials
      .filter((material) => material.status === "approved")
      .map((material) => ({
        ...material,
        courseId: mapCourseId(material.courseId, material.courseName, identity.courseIdAliases, identity.courseIdByName),
      }));
    return courseId ? materials.filter((material) => material.courseId === courseId) : materials;
  }

  const identity = await getCourseIdentity();
  const courseIds = courseId
    ? [...identity.courseIdAliases]
      .filter(([, canonicalId]) => canonicalId === courseId)
      .map(([id]) => id)
    : [];
  if (courseId && !courseIds.length) return [];

  let query = getSupabaseClient()
    .from("materials")
    .select("id, course_id, title, file_path, file_name, file_size, mime_type, status, submitted_by, created_at, approved_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (courseId) query = query.in("course_id", courseIds);
  const { data, error } = await query;
  if (error) throw error;

  const storage = getSupabaseClient().storage.from("materials");
  return data.map((material) => ({
    id: material.id,
    courseId: mapCourseId(material.course_id, null, identity.courseIdAliases, identity.courseIdByName),
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
}
