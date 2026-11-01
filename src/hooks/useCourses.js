import { getCourses } from "../services/courses.js";
import { useResource } from "./useResource.js";

export function useCourses() {
  return useResource(getCourses);
}
