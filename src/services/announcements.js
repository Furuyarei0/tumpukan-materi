import { getDevelopmentFixtures } from "./dataAdapter.js";
import { getSupabaseClient } from "../lib/supabase.js";
import { getCourseIdentity } from "./courses.js";
import { mapCourseId } from "../lib/course-catalog.js";

export async function getAnnouncements() {
  const fixtures = await getDevelopmentFixtures();
  const identity = await getCourseIdentity();
  if (fixtures) {
    return fixtures.tasks.map((task) => ({
      ...task,
      courseId: task.courseId
        ? mapCourseId(task.courseId, task.courseName, identity.courseIdAliases, identity.courseIdByName)
        : null,
    }));
  }

  const { data, error } = await getSupabaseClient()
    .from("announcements")
    .select("id, course_id, title, description, deadline, submission_method, created_at, updated_at, course:courses(name)")
    .order("deadline", { ascending: true, nullsFirst: false });

  if (error) throw error;

  return data.map((task) => ({
    id: task.id,
    courseId: task.course_id
      ? mapCourseId(task.course_id, task.course?.name, identity.courseIdAliases, identity.courseIdByName)
      : null,
    courseName: task.course?.name ?? "",
    title: task.title,
    description: task.description ?? "",
    deadline: task.deadline,
    submissionMethod: task.submission_method ?? "",
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  }));
}
