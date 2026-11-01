export function normalizeSearchTerm(value) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID");
}

export function filterCourseSearch(courses, materials, query, limit = 20) {
  const normalizedQuery = normalizeSearchTerm(query);
  if (!normalizedQuery) return { courses: [], materials: [] };

  const courseById = new Map(courses.map((course) => [course.id, course]));
  const matches = [
    ...courses
      .filter((course) => normalizeSearchTerm(course.name).includes(normalizedQuery))
      .map((course) => ({ kind: "course", course })),
    ...materials
      .filter((material) => {
        const courseName = courseById.get(material.courseId)?.name ?? material.courseName;
        return material.status === "approved"
          && courseName
          && normalizeSearchTerm(material.title).includes(normalizedQuery);
      })
      .map((material) => ({
        kind: "material",
        material: { ...material, courseName: courseById.get(material.courseId)?.name ?? material.courseName },
      })),
  ].slice(0, Math.max(0, limit));

  return {
    courses: matches.filter((match) => match.kind === "course").map((match) => match.course),
    materials: matches.filter((match) => match.kind === "material").map((match) => match.material),
  };
}
