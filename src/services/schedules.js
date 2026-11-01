import { getDevelopmentFixtures } from "./dataAdapter.js";
import { getSupabaseClient } from "../lib/supabase.js";
import { getCourseIdentity } from "./courses.js";
import { mapCourseId } from "../lib/course-catalog.js";

export async function getSchedules() {
  const fixtures = await getDevelopmentFixtures();
  const { courseIdAliases } = await getCourseIdentity();
  if (fixtures) {
    return fixtures.schedules.map((schedule) => ({
      ...schedule,
      courseId: mapCourseId(schedule.courseId, schedule.courseName, courseIdAliases),
    }));
  }

  const { data, error } = await getSupabaseClient()
    .from("schedules")
    .select("id, course_id, day_of_week, start_time, end_time, room, starts_on, ends_on")
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw error;

  return data.map((schedule) => ({
    id: schedule.id,
    courseId: mapCourseId(schedule.course_id, null, courseIdAliases),
    dayOfWeek: schedule.day_of_week,
    startTime: schedule.start_time.slice(0, 5),
    endTime: schedule.end_time.slice(0, 5),
    room: schedule.room ?? "",
    startsOn: schedule.starts_on,
    endsOn: schedule.ends_on,
  }));
}
