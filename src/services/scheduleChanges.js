import { getDevelopmentFixtures } from "./dataAdapter.js";
import { getSupabaseClient } from "../lib/supabase.js";
import { getCourseIdentity } from "./courses.js";
import { mapCourseId } from "../lib/course-catalog.js";

export async function getScheduleChanges() {
  const fixtures = await getDevelopmentFixtures();
  const { courseIdAliases } = await getCourseIdentity();
  if (fixtures) {
    return fixtures.scheduleChanges.map((change) => ({
      ...change,
      courseId: mapCourseId(change.courseId, change.courseName, courseIdAliases),
    }));
  }

  const { data, error } = await getSupabaseClient()
    .from("schedule_changes")
    .select("id, kind, course_id, schedule_id, original_date, new_date, start_time, end_time, room, note, created_at");

  if (error) throw error;

  return data.map((change) => ({
    id: change.id,
    kind: change.kind,
    courseId: mapCourseId(change.course_id, null, courseIdAliases),
    scheduleId: change.schedule_id,
    originalDate: change.original_date,
    newDate: change.new_date,
    startTime: change.start_time?.slice(0, 5) ?? "",
    endTime: change.end_time?.slice(0, 5) ?? "",
    room: change.room ?? "",
    note: change.note ?? "",
    createdAt: change.created_at,
  }));
}
