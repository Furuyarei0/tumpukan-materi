export function normalizeCourseName(name) {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID");
}

export function createCourseCatalog(records) {
  const sortedRecords = [...records].sort((left, right) => (
    (left.createdAt ?? "").localeCompare(right.createdAt ?? "")
    || left.id.localeCompare(right.id)
  ));
  const courseByName = new Map();
  const courseIdAliases = new Map();

  for (const course of sortedRecords) {
    const key = normalizeCourseName(course.name);
    if (!courseByName.has(key)) courseByName.set(key, course);
    courseIdAliases.set(course.id, courseByName.get(key).id);
  }

  return {
    courses: [...courseByName.values()],
    courseIdAliases,
    courseIdByName: new Map([...courseByName].map(([name, course]) => [name, course.id])),
  };
}

export function mapCourseId(courseId, courseName, courseIdAliases, courseIdByName) {
  return courseIdAliases?.get(courseId)
    ?? courseIdByName?.get(normalizeCourseName(courseName ?? ""))
    ?? courseId;
}
